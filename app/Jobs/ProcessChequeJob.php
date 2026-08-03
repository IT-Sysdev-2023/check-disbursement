<?php

namespace App\Jobs;

use App\Events\AlreadyScannedEvent;
use App\Events\ScannedRecordEvent;
use App\Events\ScanningChequesEvent;
use App\Models\BorrowedCheque;
use App\Models\Crf;
use App\Models\Cv;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\ScannedRecords;
use Carbon\Carbon;
use Illuminate\Database\QueryException;

class ProcessChequeJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public string $imagePath, public int $id, public int $count, public int $totalcount) {}
    public $tries = 5;

    public function backoff(): array
    {
        return [10, 30, 60, 120];
    }
    public function handle(): void
    {
        $alreadyScanned = [];
        try {

            $bytes = Storage::disk('cheque_share')->get($this->imagePath);

            $payload = self::payLayoadFunction($bytes);

            $response = self::httpResponseFunction($payload);

            if ($response->status() === 503) {
                Log::warning('Gemini is busy, retrying...', [
                    'image' => $this->imagePath,
                ]);

                $this->release(30);

                return;
            }

            if (!$response->successful()) {
                throw new \Exception(
                    "Gemini API failed ({$response->status()}): " . $response->body()
                );
            }

            $text = $response->json('candidates.0.content.parts.0.text', '');

            // Clean JSON response
            $clean = preg_replace('/```json|```/', '', $text);
            $data = json_decode(trim($clean), true);

            $amount = $data['amount'] ?? null;
            $chequeNumber = $data['cheque_no'] ?? null;

            $borrowedIChequeId = BorrowedCheque::whereHasMorph(
                'checkable',
                [Crf::class, Cv::class],
                function ($q, $type) use ($chequeNumber, $amount) {
                    $q->where(function ($query) use ($chequeNumber) {
                        $query->where('cheque_number', $chequeNumber)
                            ->orWhere(function ($query) use ($chequeNumber) {
                                $query->where(function ($q) {
                                    $q->whereNull('cheque_number')
                                        ->orWhere('cheque_number', 0);
                                })
                                    ->where('resolved_cheque_number', $chequeNumber);
                            });
                    })
                        ->where('cheque_amount', $amount);
                }
            )->whereNotNull(['approved_at', 'approver_id'])->value('id');

            if ($borrowedIChequeId) {
                $result = ScannedRecords::create([
                    'payee' => $data['payee'] ?? null,
                    'borrowed_cheque_id' => $borrowedIChequeId,
                    'amount' => $amount,
                    'account_number' => $data['account_no'] ?? null,
                    'amount_in_words' => $data['amount_in_words'] ?? null,
                    'bank_address' => $data['bank_address'] ?? null,
                    'micr_number' => $data['micr_number'] ?? null,
                    'serial_code' => $data['serial_code'] ?? null,
                    'barcode_or_qr' => $data['barcode_or_qr'] ?? null,
                    'account_name' => $data['account_name'] ?? null,
                    'cheque_no' => $chequeNumber,
                    'cheque_date' => Carbon::createFromFormat('m-d-Y', $data['date']) ?? null,
                    'bank_account_name' => $data['bank_name'] ?? null,
                    'caused_by' => $this->id,
                ]);
                ScannedRecordEvent::dispatch($result, $this->id);
            }
        } catch (QueryException $e) {
            if ($e->errorInfo[1] === 1062) {
                $alreadyScanned = [
                    'cheque_no' => $data['cheque_no'] ?? null,
                    'account_no' => $data['account_no'] ?? null,
                    'bank_account_name' => $data['bank_name'] ?? null,
                ];

                AlreadyScannedEvent::dispatch($alreadyScanned, $this->id);
                return; // important: don't retry on duplicate
            }
            throw $e;
        } catch (\Exception $e) {
            // $this->check->update(['status' => 'failed']);
            throw $e; // let Laravel retry
        }
    }

    private function promptFunction()
    {
        return "Analyze this Philippine check image carefully. Return ONLY valid JSON (no markdown, no explanation, no code fences) in this exact structure:
{\"payee\": \"string\", \"amount\": number, \"account_no\": \"string\", 
\"signed\": boolean, \"cheque_no\": \"string\", \"bank_name\": \"string\", 
\"date\": \"string\", \"bank_address\": \"string\", \"micr_number\": \"string\", 
\"barcode_or_qr\": \"string\", \"serial_code\": \"string\", \"amount_in_words\": \"string\",\"account_name\": \"string\"}

Field instructions:
- payee: the name written on the 'PAY TO THE ORDER OF' line.
- amount: the numeric amount in the amount box, as a number (no currency symbol, no commas).
- account_no: the account number printed top-left.
- signed: true if a signature is visible in the signature box, false otherwise.
- cheque_no: the check number printed top-right.
- bank_name: the issuing bank's name.
- date: the date as printed (MM-DD-YYYY format if available).
- bank_address: the branch name and address printed near the bank logo.
- micr_number: the full raw MICR line at the bottom of the check (the row of stylized numbers/symbols), transcribed as-is.
- barcode_or_qr: the code/text printed directly below or near the barcode or QR code, if present.
- serial_code: the BRSTN branch/serial code printed in the top-right corner (distinct from cheque_no).

Rules:
- If any field is not visible, not printed, or not present on the check, return an empty string \"\" for that field (or false for signed if no signature is visible).
- Do not guess or fabricate values.
- If the handwritten legal amount (in words) does not match the numeric amount box, still extract both values as seen — do not attempt to reconcile them.
- Return valid JSON only, with no leading or trailing text.";
    }

    public function payLayoadFunction($bytes)
    {
        return
            [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => self::promptFunction()],
                            [
                                'inline_data' => [
                                    'mime_type' => 'image/jpeg',
                                    'data' => base64_encode($bytes)
                                ]
                            ]
                        ]
                    ]
                ]
            ];
    }
    private function httpResponseFunction($payload)
    {
        return  Http::timeout(60)
            ->retry(3, 2000)
            ->post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" .
                    config('app.GEMINI_API_KEY'),
                $payload
            );
    }
}

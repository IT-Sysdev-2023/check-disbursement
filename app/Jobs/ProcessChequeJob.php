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

    public function __construct(public string $imagePath, public int $id, public int $count, public int $totalcount)
    {
    }
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

            $prompt = "Analyze this Philippine check. Return ONLY JSON: 
                {\"payee\": \"string\", \"amount\": number, \"account_no\": \"string\", 
                \"signed\": boolean, \"cheque_no\": \"string\", \"bank_name\": \"string\ , \"date\": \"string\"}";

            $payload = [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt],
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

            $response = Http::timeout(60)
                ->retry(3, 2000)
                ->post(
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" .
                    config('app.GEMINI_API_KEY'),
                    $payload
                );

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
                    $amountColumn = $type === Crf::class ? 'amount' : 'cheque_amount';
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
                    ->where($amountColumn, $amount);
                }
            )->whereNotNull(['approved_at', 'approver_id'])->value('id');

            if ($borrowedIChequeId) {
                $result = ScannedRecords::create([
                    'payee' => $data['payee'] ?? null,
                    'borrowed_cheque_id' => $borrowedIChequeId,
                    'amount' => $amount,
                    'account_number' => $data['account_no'] ?? null,
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
}

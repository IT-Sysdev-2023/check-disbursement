<?php

namespace App\Services;

use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Helpers\StringHelper;
use App\Models\BorrowedCheque;
use App\Models\Crf;
use App\Models\Cv;
use Illuminate\Support\Str;

class ReleasingService
{
    public function __construct(protected FileHandler $fileHandler)
    {
    }

    public function release(array $validated, int $userId)
    {
        $transactionNo = now()->format('YmdHis') . '-' . auth()->id();
        $locations = [];
        $chequesDetails = [];
        $handleFiles = $this->fileHandler->handleFiles($validated, $transactionNo);
        foreach ($validated['cheques'] as $cheque) {
            $borrowedCheque = BorrowedCheque::findOrFail($cheque['id']);
            $label = StringHelper::statusPastTense($cheque['status']);

            $chequeStatus = $borrowedCheque->checkable
                ->chequeStatus()
                ->create([
                    'transaction_no' => $transactionNo,
                    'status' => Str::lower($label),
                    'receiver_name' => $validated['receiversName'],
                    'image' => $handleFiles->imagePath,
                    'signature' => $handleFiles->signaturePath,
                    'caused_by' => $userId,
                ]);

            $checkable = $chequeStatus->checkable;

            $chequesDetails[] = $checkable->only([
                $checkable instanceof Cv ? 'cv_no' : 'crf_no',
                'cheque_number',
                'cheque_date',
                'payee',
                'cheque_amount',
            ]);

            $locations[] = $checkable?->getLocation;
        }

        return [
            'transactionNo' => $transactionNo,

            'dateLabel' => 'Date Released:',
            'dateReleased' => now()->format('M d, Y H:i A'),

            'causedBy' => auth()->user()->name,

            'receivedBy' => $validated['receiversName'],
            'signature' => $handleFiles->signatureUri,
            'location' => implode(', ', array_unique($locations)),
            'cheques' => $chequesDetails

        ];
    }

    public function releaseAll($validated)
    {
        $transactionNo = now()->format('YmdHis') . '-' . auth()->id();
        $locations = [];
        $chequesDetails = [];

        $cheques = self::data($validated);
        $handleFiles = $this->fileHandler->handleFiles($validated, $transactionNo);
        foreach ($cheques as $cheque) {
            $borrowedCheque = BorrowedCheque::findOrFail($cheque['id']);
            $label = StringHelper::statusPastTense($cheque['status']);

            $chequeStatus = $borrowedCheque->checkable
                ->chequeStatus()
                ->create([
                    'transaction_no' => $transactionNo,
                    'status' => Str::lower($label),
                    'receiver_name' => $validated['receiversName'],
                    'image' => $handleFiles->imagePath,
                    'signature' => $handleFiles->signaturePath,
                    'caused_by' => auth()->user()->id,
                ]);

            $checkable = $chequeStatus->checkable;

            $chequesDetails[] = $checkable->only([
                $checkable instanceof Cv ? 'cv_no' : 'crf_no',
                'cheque_number',
                'cheque_date',
                'payee',
                'cheque_amount',
            ]);

            $locations[] = $checkable?->getLocation;
        }

        return [
            'transactionNo' => $transactionNo,

            'dateLabel' => 'Date Released:',
            'dateReleased' => now()->format('M d, Y H:i A'),
            'causedBy' => auth()->user()->name,

            'receivedBy' => $validated['receiversName'],
            'signature' => $handleFiles->signatureUri,

            'location' => implode(', ', array_unique($locations)),
            'cheques' => $chequesDetails

        ];
    }

    private static function data(array $validated)
    {
        $getCheques = self::query($validated['batchReference'], $validated['isForwarded']);

        return $getCheques->map(function ($cheque) {
            $location = $cheque->checkable?->getLocation;
            return [
                'id' => $cheque->id,
                'status' => match ($location) {
                    'Manila', 'Cebu' => 'Forward',
                    'Deposit' => 'Deposit',
                    default => 'Release',
                },
            ];
        })
            ->values()
            ->all();
    }

    private static function query(string $batchReference, bool $isForwarded)
    {
        return BorrowedCheque::whereRelation(
            'scannedRecord',
            'batch_reference',
            $batchReference
        )
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )
            // ->when($isForwarded, function ($builder) {
            //     $builder->whereHasMorph(
            //         'checkable',
            //         [Cv::class, Crf::class],
            //         fn($query) => $query->whereIn('tag_location_id', [1, 2])
            //     );
            // }, fn($builder) => $builder->whereHasMorph(
            //         'checkable',
            //         [Cv::class, Crf::class],
            //         fn($query) => $query->whereNotIn('tag_location_id', [1, 2])
            //     ))
            ->get();
    }

    public static function forwardQuery(int $location)
    {
        return BorrowedCheque::
            whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )
            ->whereHasMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->where('tag_location_id', $location)
            )
            ->get();
    }

    public function getLocation($location)
    {
        $loc = [
            'cebu' => 1,
            'manila' => 2
        ];

        return $loc[$location];
    }

    public static function mapLocation($cheques)
    {
        return $cheques->map(function ($cheque) {
            $location = $cheque->checkable?->getLocation;

            return [
                'id' => $cheque->id,
                'status' => match ($location) {
                    'Manila', 'Cebu' => 'Forward',
                    'Deposit' => 'Deposit',
                    default => 'Release',
                },
            ];
        })->values()->all();
    }


    public static function getRangeTransaction(string $location)
    {
        $dates = BorrowedCheque::
            whereNot('approver_id', null)

            ->has('scannedRecord')
            ->whereHasMorph('checkable', [Cv::class, Crf::class], fn($q) => $q->where('tag_location_id', $location)) // Manila and Cebu
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )->get()
            ->pluck('checkable.tagged_at');

        $oldestDate = $dates->min();
        $latestDate = $dates->max();

        return $oldestDate && $latestDate
            ? $oldestDate->format('M d, Y') . ' - ' . $latestDate->format('M d, Y')
            : 'No dates available';
    }


}
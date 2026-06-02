<?php

namespace App\Exports;


use App\Models\ChequeStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class CvReportExport implements FromQuery, WithHeadings, WithTitle, ShouldAutoSize
{
    /**
     * @return \Illuminate\Support\Collection
     */

    protected array $columns;
    protected array $validated;
    public function __construct(array $columns, array $validated)
    {
        $this->columns = $columns;
        $this->validated = $validated;
    }

      public function title(): string
    {
        return 'Cv Report';
    }

    public function headings(): array
    {
        return array_map(
            fn($value) => Str::headline($value),
            $this->columns
        );
    }

    public function query()
    {
        $validated = $this->validated;

        $columns = $this->columns;

        $doesIncludeCN = in_array('cheque_number', $columns);
        $doesIncludeCD = in_array('cheque_date', $columns);

        if ($doesIncludeCN) {
            $columns = array_map(fn($col) => $col === 'cheque_number' ? DB::raw('CASE WHEN cheque_number != 0 THEN cheque_number ELSE resolved_cheque_number END as cheque_number') : $col, $columns);
        }

        if ($doesIncludeCD) {
            $columns = array_map(fn($col) => $col === 'cheque_date' ? DB::raw('CASE WHEN cheque_date IS NOT NULL THEN cheque_date ELSE resolved_cheque_date END as cheque_date') : $col, $columns);
        }

        if (in_array('status', $columns)) { //select the 'check_forwarded_statuses' status if there is a relationship there otherwise use the 
            $columns = array_map(
                fn($col) => $col === 'status'
                ? DB::raw('COALESCE(check_forwarded_statuses.status, check_statuses.status) AS status')
                : $col,
                $columns
            );
        }

        return ChequeStatus::select($columns)
            ->join('cv_check_payments', 'cv_check_payments.id', '=', 'check_statuses.checkable_id')
              ->join('borrowed_checks', function ($join) {
                $join->on('cv_check_payments.id', '=', 'borrowed_checks.checkable_id')
                    ->where('borrowed_checks.checkable_type', 'cv');
            })
            ->leftJoin('cv_headers', 'cv_check_payments.cv_header_id', '=', 'cv_headers.id')
            ->join('companies', 'cv_check_payments.company_id', '=', 'companies.id')
            ->join('borrowers', 'borrowed_checks.borrower_id', '=', 'borrowers.id')
            ->join('tag_locations', 'cv_check_payments.tag_location_id', '=', 'tag_locations.id')
            ->leftJoin('approvers', 'borrowed_checks.secondary_approver_id', '=', 'approvers.id')
            ->leftJoin('check_forwarded_statuses', 'check_forwarded_statuses.check_status_id', '=', 'check_statuses.id')
            ->where('check_statuses.checkable_type', 'cv')
            ->when(
                !empty($validated['status']),
                fn($query) =>
                $query->whereIn(DB::raw('COALESCE(check_forwarded_statuses.status, check_statuses.status)'), $validated['status'])
            )
            ->when(
                !empty($validated['bu']),
                fn($query) =>
                $query->whereIn('companies.name', $validated['bu'])
            )
            ->when(
                !empty($validated['borrower']),
                fn($query) =>
                $query->whereIn('borrowers.name', $validated['borrower'])
            )
            ->when(
                !empty($validated['location']),
                fn($query) =>
                $query->whereIn('tag_locations.location', $validated['location'])
            );
    }
}

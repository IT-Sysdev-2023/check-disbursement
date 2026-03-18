<?php

namespace App\Exports;

use App\Models\CheckStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class CrfReportExport implements FromQuery, WithHeadings, WithTitle, ShouldAutoSize
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
        return 'Crf Report';
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

        $doesIncludeCN = in_array('ck_no', $columns);
        $doesIncludeCD = in_array('check_date', $columns);

        if ($doesIncludeCN) {
            $columns = array_map(fn($col) => $col === 'ck_no' ? DB::raw('CASE WHEN ck_no != 0 THEN ck_no ELSE resolved_check_number END as ck_no') : $col, $columns);
        }

        if ($doesIncludeCD) {
            $columns = array_map(fn($col) => $col === 'check_date' ? 'resolved_check_date' : $col, $columns);
        }

        //select the 'check_forwarded_statuses' status if there is a relationship there otherwise use the status in parent table instead
        if (in_array('status', $columns)) {
            $columns = array_map(
                fn($col) => $col === 'status'
                ? DB::raw('COALESCE(check_forwarded_statuses.status, check_statuses.status) AS status')
                : $col,
                $columns
            );
        }

        return CheckStatus::select($columns)
            ->join('crfs', 'crfs.id', '=', 'check_statuses.checkable_id')
            ->join('borrowed_checks', function ($join) {
                $join->on('crfs.id', '=', 'borrowed_checks.checkable_id')
                    ->where('borrowed_checks.checkable_type', 'crf');
            })
            ->join('companies', 'crfs.company_id', '=', 'companies.id')
            ->join('borrowers', 'borrowed_checks.borrower_id', '=', 'borrowers.id')
            ->join('tag_locations', 'crfs.tag_location_id', '=', 'tag_locations.id')
            ->leftJoin('approvers', 'borrowed_checks.secondary_approver_id', '=', 'approvers.id')
            ->leftJoin('check_forwarded_statuses', 'check_forwarded_statuses.check_status_id', '=', 'check_statuses.id')
            ->where('check_statuses.checkable_type', 'crf')
            ->when(
                !empty($validated['status']),
                fn($query) =>
                $query->whereIn(DB::raw('COALESCE(check_forwarded_statuses.status, check_statuses.status)'), $validated['status'])
            )
            ->when(!empty($validated['bu']), function ($query) use ($validated) {
                $query->whereIn('companies.name', $validated['bu']);
            })
            ->when(!empty($validated['borrower']), function ($query) use ($validated) {
                $query->whereIn('borrowers.name', $validated['borrower']);
            })
            ->when(!empty($validated['location']), function ($query) use ($validated) {
                $query->whereIn('tag_locations.location', $validated['location']);
            });
    }
}

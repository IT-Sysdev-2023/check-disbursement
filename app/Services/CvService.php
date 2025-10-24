<?php

namespace App\Services;

use App\Events\CvProgress;
use App\Jobs\CvServer;
use App\Models\Cv;
use App\Models\CvCheckPayment;
use App\Models\NavHeaderTable;
use App\Models\NavServer;
use App\Models\User;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Connection;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
use function Pest\Laravel\getConnection;
class CvService extends NavConnection
{
    /**
     * Create a new class instance.
     */


    protected User $user;
   
    public function __construct()
    {
    }
    public function retrieveData(User $user, object $date)
    {
        // Get all the Navition Servers
        $nav = NavServer::select('id', 'name', 'username', 'password', 'port')
            ->withWhereHas('navDatabases', function (Builder $query) {
                $query->with('navHeaderTable', 'navLineTable', 'navCheckPaymentTable');
            })
            ->lazy();

        $id = $user->id;
        $nav->each(
            fn(NavServer $server) =>
            CvServer::dispatch($server, $id, $date)
        );
    }

    public function setDateFilter(object $date)
    {
        $this->dateFilter = $date;
        return $this;
    }

    public function storeHeaderRecord(?NavHeaderTable $navHeaderTable)
    {
        if ($navHeaderTable) {
            $start = 1;

            $tableName = $navHeaderTable->name;
            $tableId = $navHeaderTable->id;

            $query = $this->filterHeaderRecord($tableName);
            $total = $query->count();

            $query->orderBy('Check Voucher No_')
                ->chunkById(500, function ($cv) use (&$start, $total, $tableName, $tableId) {
                    $data = $cv->map(
                        function ($item) use (&$start, $total, $tableName, $tableId) {

                            CvProgress::dispatch("Generating Cv Header" . $tableName . " in progress.. ", $start, $total, $this->user);
                            $start++;
                            return [
                                'nav_header_table_id' => $tableId,
                                'cv_no' => $item->{'Check Voucher No_'},
                                'cv_date' => $item->{'CV Date'} ? Date::parse($item->{'CV Date'}) : null,
                                'cv_status' => $item->{'CV Status'},
                                'collector_name' => $item->{'Collector Name'},
                                'vendor_no' => $item->{'Vendor No_'},
                                'batch_name' => $item->{'Batch Name'},
                                'bal_account_type' => $item->{'Bal_ Account Type'},
                                'bal_account_no' => $item->{'Bal_ Account No_'},
                                'gl_document_no' => $item->{'G_L Document No_'},
                                'remarks' => $item->{'Remarks'},
                                'no_series' => $item->{'No_ Series'},
                                'vendor_name' => $item->{'Vendor Name'},
                                'cv_type' => $item->{'CV Type'},
                                'no_printed' => $item->{'No_ Printed'},
                                'cancelled_by' => $item->{'Cancelled By'},
                                'cancelled_date' => $item->{'Cancelled Date'} ? Date::parse($item->{'Cancelled Date'}) : null,
                                'checked_by' => $item->{'Checked By'},
                                'approved_by' => $item->{'Approved By'},
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];
                        }
                    )->toArray();

                    DB::transaction(
                        fn() =>
                        DB::table('cv_headers')->insertOrIgnore($data)
                    );
                }, 'Check Voucher No_');
        }
    }

    public function setUser(User $user)
    {
        $this->user = $user;
        return $this;
    }

    public function cvs(?int $page)
    {
        return Inertia::render('retrieveCvCrf', [
            'cv' => CvCheckPayment::paginate($page)
        ]);
    }

    public function details(CvCheckPayment $cv)
    {
        return Inertia::render('dashboard/cv/cvDetails', [
            'cv' => $cv
        ]);
    }

    private function checkDatabase()
    {
        //  $con = Schema::connection('sqlsrvCaf')->getTables();
        // $tables = collect($con)->filter(function ($table) {
        //     return Str::contains($table['name'], 'CV');
        // });
        // dd($tables);

        // dd($servers);
        // $start = "2017-08-05";
        // $end = "2017-09-08";
        // $con = DB::connection('sqlsrvCaf')->table('ALTA CITTA ACCOUNTING$CV Check Payment')
        // ->whereRaw("CONVERT(VARCHAR(10), [Check Date], 120) BETWEEN ? AND ?", [$start, $end])
        // ->limit(10)->get();
        // dd($con);
    }
}

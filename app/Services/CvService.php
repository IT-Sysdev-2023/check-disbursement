<?php

namespace App\Services;

use App\Enums\ProgressStatus;
use App\Events\CvProgress;
use App\Http\Resources\CvResource;
use App\Jobs\CvDatabase;
use App\Jobs\CvServer;
use App\Models\BusinessUnit;
use App\Models\ChequeRecord;
use App\Models\ChequeStatus;
use App\Models\Company;
use App\Models\Cv;
use App\Models\CvCheckPayment;
use App\Models\NavHeaderTable;
use App\Models\NavServer;
use App\Models\User;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Illuminate\Bus\Batch;
use Inertia\Inertia;
use Throwable;
class CvService
{
    /**
     * Create a new class instance.
     */



    public function __construct()
    {
    }
    public function index(User $user)
    {
        $bu = PermissionService::getCompanyPermissions($user)->prepend([
            'label' => 'All',
            'value' => 'all',
        ]);
        return Inertia::render('extract/extractCv', [
            'bu' => $bu
        ]);
    }
    public function retrieveData(Request $request)
    {

        $validated = $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'company' => ['required', 'array', 'min:1'],
            'bu' => ['required', 'array', 'min:1'],
        ]);

        $date = (object) [
            'start' => $validated['start_date'],
            'end' => $validated['end_date']
        ];

        $user = $request->user();
        $bu = $validated['bu'];
        $company = $validated['company'];

        // Get all the Navition Servers
        $buId = BusinessUnit::
            when(!in_array('All', $bu), function ($q) use ($bu) {
                $q->whereIn('name', $bu);
            })
            ->when(!in_array('All', $company), function ($q) use ($company) {
                $q->whereHas('company', fn($q) => $q->whereIn('name', $company));
            })
            ->pluck('id', 'name')->values();

        $nav = NavServer::select('id', 'host', 'username', 'password', 'port')
            ->withWhereHas('navDatabases', function (Builder $query) use ($buId) {
                $query->whereIn('business_unit_id', $buId)
                    ->with('navHeaderTable', 'navChequePaymentTable');
            })
            ->lazy();

        if ($nav->isEmpty()) {
            return response()->json([
                'message' => 'No connection found in the server !',
                'status' => 'error'
            ]);
        }

        $id = $user->id;
        $allJobs = [];
        $nav->each(function (NavServer $server) use ($id, $date, &$allJobs) {
            foreach ($server->navDatabases as $db) {
                $allJobs[] = new CvDatabase($server->id, $id, $date, $db->id);
            }
        });
        Bus::batch($allJobs)
            ->name("CV Import All Servers")
            ->allowFailures()
            ->then(function (Batch $batch) use ($id) {
                CvProgress::dispatch($id, "Data Retrieval Completed", ProgressStatus::Finished);
            })
            ->catch(function (Batch $batch, Throwable $e) use ($id) {
                CvProgress::dispatch($id, "Data Retrieval Failed: " . $e->getMessage(), ProgressStatus::NoConnection);
            })
            ->dispatch();

    }

    public function details(Cv $cv)
    {
        return Inertia::render('retrievedRecords/checkDetailsCv', [
            'cv' => new CvResource($cv->load('chequeStatus'))
        ]);
    }

    public function signatureDetails(Request $request)
    {
        $cheque = ChequeRecord::where([
            'source_id' => $request->id,
            'type' => $request->type,
        ])->firstOrFail();

        $cheque->load('source');

        return Inertia::render('retrievedRecords/checkDetailsCvSignature', [
            'cheque' => $cheque->toResource()
        ]);
    }

    public function businessUnits(Request $request)
    {
        $companies = $request->companies;
        $bu = BusinessUnit::query()
            ->select('id as value', 'name as label')
            ->when(!in_array('All', $companies), function ($q) use ($companies) {
                $q->whereHas(
                    'company',
                    fn($q) =>
                        $q->whereIn('name', $companies)
                );
            })
            ->get()
            ->values()
            ->prepend([
                'label' => 'All',
                'value' => 'all',
            ]);
        return response()->json($bu);
    }
}

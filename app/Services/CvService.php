<?php

namespace App\Services;

use App\Enums\ProgressStatus;
use App\Events\CvProgress;
use App\Http\Resources\CvCheckPaymentResource;
use App\Jobs\CvDatabase;
use App\Jobs\CvServer;
use App\Models\BusinessUnit;
use App\Models\Company;
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
        $bu = PermissionService::getCompanyPermissions($user);
        return Inertia::render('extract/extractCv', [
            'bu' => $bu
        ]);
    }
    public function retrieveData(Request $request)
    {

        $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'company' => ['required', 'array', 'min:1'],
            'bu' => ['required', 'array', 'min:1'],
        ]);
        $date = (object) [
            'start' => $request->start_date,
            'end' => $request->end_date
        ];

        $user = $request->user();

        // Get all the Navition Servers
        $buId = BusinessUnit::
            when(!in_array('All', $request->bu), function ($q) use ($request) {
                $q->whereIn('name', $request->bu);
            })
            ->pluck('id', 'name')->values();

        $nav = NavServer::select('id', 'name', 'username', 'password', 'port')
            ->withWhereHas('navDatabases', function (Builder $query) use ($buId) {
                $query->whereIn('business_unit_id', $buId)
                    ->with('navHeaderTable', 'navLineTable', 'navCheckPaymentTable');
            })
            ->lazy();

        $id = $user->id;
        $allJobs = [];

        $nav->each(function (NavServer $server) use ($id, $date, &$allJobs) {
            foreach ($server->navDatabases as $db) {
                $allJobs[] = new CvDatabase($server->id, $id, $date, $db->id);
            }
        });

        Bus::batch($allJobs)
            ->name("CV Import All Servers")
            ->then(function (Batch $batch) use ($id) {
                CvProgress::dispatch($id, "Data Retrieval Completed", ProgressStatus::Finished);
            })
            ->catch(function (Batch $batch, Throwable $e) use ($id) {
                CvProgress::dispatch($id, "Data Retrieval Failed: " . $e->getMessage(), ProgressStatus::NoConnection);
            })
            ->dispatch();

    }

    public function details(CvCheckPayment $cv)
    {
        return Inertia::render('retrievedRecords/checkDetailsCv', [
            'cv' => new CvCheckPaymentResource($cv->load('cvHeader:id,cv_no,vendor_no,remarks', 'checkStatus'))
        ]);
    }

    public function signatureDetails(CvCheckPayment $cv)
    {
        return Inertia::render('retrievedRecords/checkDetailsCvSignature', [
            'cv' => new CvCheckPaymentResource($cv->load('cvHeader:id,cv_no,vendor_no,remarks', 'checkStatus'))
        ]);
    }

    public function businessUnits(Request $request)
    {
        $bu = BusinessUnit::query()
            ->whereHas(
                'company',
                fn($q) =>
                $q->whereIn('name', $request->companies)
            )
            ->pluck('name', 'id')
            ->map(fn($label, $value) => compact('label', 'value'))
            ->values()
            ->prepend([
                'label' => 'All',
                'value' => 'all',
            ]);
        return response()->json($bu);
    }
}

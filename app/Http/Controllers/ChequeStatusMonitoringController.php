<?php

namespace App\Http\Controllers;

use App\Models\ChequeRegister;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChequeStatusMonitoringController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 15;
        $currentPage = request()->integer('page', 1);
        $data = collect(DB::select("
            WITH RECURSIVE cheque_numbers AS (
                SELECT
                    id AS register_id,
                    cheque_from AS cheque_number,
                    cheque_to
                FROM cheque_registers

                UNION ALL

                SELECT
                    register_id,
                    cheque_number + 1,
                    cheque_to
                FROM cheque_numbers
                WHERE cheque_number < cheque_to
            ),

            cheque_documents AS (
                SELECT
                    id,
                    cheque_number,
                    payee,
                    cheque_date,
                    cheque_amount,
                    'cv' AS source
                FROM cvs

                UNION ALL

                SELECT
                    id,
                    cheque_number,
                    payee,
                    cheque_date,
                    cheque_amount,
                    'crf' AS source
                FROM crfs
            )

            SELECT
                cn.cheque_number AS id,
                cn.register_id,
                cn.cheque_number,

                cd.id AS document_id,
                cd.source AS document_type,
                cd.payee,
                cd.cheque_date,
                cd.cheque_amount

            FROM cheque_numbers cn

            LEFT JOIN cheque_documents cd
                ON cd.cheque_number = cn.cheque_number

            ORDER BY
                cn.register_id,
                cn.cheque_number
        "));

        $items = $data->forPage($currentPage, $perPage)->values();

        $data = new LengthAwarePaginator(
            $items,
            $data->count(),
            $perPage,
            $currentPage,
            [
                'path' => request()->url(),
                'query' => request()->query(),
            ]
        );

        return Inertia::render('chequeStatusRange', [
            'data' => $data,

        ]);
    }
}

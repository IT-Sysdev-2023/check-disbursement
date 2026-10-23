<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            CREATE OR REPLACE VIEW cheque_records AS

            SELECT
                CONCAT('cv-', cvs.id) AS uid,
                cvs.id AS source_id,
                cvs.crf_id,
                'cv' AS type,

                cvs.cv_no AS document_no,
                cvs.cv_date AS document_date,

                COALESCE(
                    NULLIF(crfs.cheque_number, 0),
                    NULLIF(cvs.cheque_number, 0),
                    cvs.resolved_cheque_number
                ) AS cheque_number,

                COALESCE(crfs.payee, cvs.payee) AS payee,
                COALESCE(crfs.cheque_amount, cvs.cheque_amount) AS amount,
                COALESCE(crfs.cheque_date, cvs.cheque_date) AS cheque_date,

                cvs.bank,
                cvs.tagged_at,
                tag_locations.location,
                companies.name AS company_name,
                business_units.name AS bu_name,

                CASE
                    WHEN cvs.crf_id IS NOT NULL THEN 1
                    ELSE 0
                END AS has_crf,

                cvs.created_at

            FROM cvs
            LEFT JOIN crfs
                ON crfs.id = cvs.crf_id
            LEFT JOIN tag_locations
                ON tag_locations.id = cvs.tag_location_id
            LEFT JOIN business_units
                ON business_units.id = cvs.business_unit_id
            LEFT JOIN companies
                ON companies.id = business_units.company_id

            UNION ALL

            SELECT
                CONCAT('crf-', crfs.id) AS uid,
                crfs.id AS source_id,
                NULL AS crf_id,
                'crf' AS type,

                crfs.crf_no AS document_no,
                crfs.crf_date AS document_date,

                COALESCE(
                    NULLIF(crfs.cheque_number, 0),
                    crfs.resolved_cheque_number
                ) AS cheque_number,

                crfs.payee,
                crfs.cheque_amount AS amount,
                COALESCE(
                    crfs.cheque_date,
                    crfs.resolved_cheque_date
                ) AS cheque_date,

                crfs.bank,
                crfs.tagged_at,
                tag_locations.location,
                companies.name AS company_name,
                business_units.name AS bu_name,

                0 AS has_crf,

                crfs.created_at

            FROM crfs
            LEFT JOIN tag_locations
                ON tag_locations.id = crfs.tag_location_id
            LEFT JOIN business_units
                ON business_units.id = crfs.business_unit_id
            LEFT JOIN companies
                ON companies.id = business_units.company_id

            WHERE NOT EXISTS (
                SELECT 1
                FROM cvs
                WHERE cvs.crf_id = crfs.id
            )
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS cheque_records');
    }
};

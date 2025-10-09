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
        Schema::create('cv_headers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nav_table_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('check_voucher_no');
            $table->string('cv_date');
            $table->string('cv_status');
            $table->string('collector_name');
            $table->string('vendor_no');
            $table->string('batch_name');
            $table->string('bal_account_type');
            $table->string('bal_account_no');
            $table->string('gl_document_no');
            $table->string('remarks');
            $table->string('no_series');
            $table->string('vendor_name');
            $table->string('cv_type');
            $table->string('no_printed');
            $table->string('cancelled_by');
            $table->string('cancelled_date');
            $table->string('checked_by');
            $table->string('approved_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cv_headers');
    }
};

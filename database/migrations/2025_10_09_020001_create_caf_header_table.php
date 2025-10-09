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
        Schema::create('caf_header', function (Blueprint $table) {
            $table->id();
            $table->string('crf_no')->unique();
            $table->dateTime('crf_date');
            $table->string('crf_status');
            $table->dateTime('collection_schedule_date');
            $table->string('collector_name');
            $table->string('vendor_no');
            $table->string('vendor_name');
            $table->string('fully_paid');
            $table->string('no_series');
            $table->string('remarks');
            $table->string('crf_type');
            $table->dateTime('check_date');
            $table->string('journal_batch_name');
            $table->string('total_amt_for_allocation');
            $table->string('journal_template_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('caf_header');
    }
};

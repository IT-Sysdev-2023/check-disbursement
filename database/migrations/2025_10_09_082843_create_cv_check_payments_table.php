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
        Schema::create('cv_check_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nav_table_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('cv_no');
            $table->string('line_no');
            $table->string('cv_status');
            $table->string('check_number');
            $table->string('check_amount');
            $table->string('bank_account_no');
            $table->string('bank_name');
            $table->dateTime('check_date');
            $table->dateTime('clearing_date');
            $table->string('cleared_flag');
            $table->string('cancelled_flag');
            $table->dateTime('cancelled_date');
            $table->string('cancelled_by');
            $table->string('cancellation_reason');
            $table->string('cancelled_with_check_number');
            $table->string('company_dimension_code');
            $table->string('department_dimension_code');
            $table->string('check_class');
            $table->string('check_class_location');
            $table->string('payee');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cv_check_payments');
    }
};

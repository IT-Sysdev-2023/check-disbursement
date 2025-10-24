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
            $table->foreignId('cv_line_id')->unique()->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->unsignedBigInteger('check_number');
            $table->decimal('check_amount', 20);
            $table->string('bank_account_no');
            $table->string('bank_name');
            $table->dateTime('check_date')->nullable();
            $table->dateTime('clearing_date')->nullable();
            $table->string('cleared_flag');
            $table->string('cancelled_flag');
            $table->dateTime('cancelled_date')->nullable();
            $table->string('cancelled_by');
            $table->string('cancellation_reason');
            $table->string('cancelled_with_check_number');
            $table->string('check_class');
            $table->string('check_class_location');
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

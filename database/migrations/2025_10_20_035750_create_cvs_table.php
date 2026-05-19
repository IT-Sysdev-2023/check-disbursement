<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cvs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nav_header_table_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('business_unit_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            // $table->string('cv_no')->unique();
            $table->unsignedBigInteger('cheque_number');
            $table->decimal('cheque_amount', 20);
            $table->date('cheque_date')->nullable();
            $table->string('payee');
            $table->string('cv_no');
            $table->date('cv_date')->nullable();
            $table->string('bank_account_no');
            $table->string('bank_name');
            $table->string('remarks');

            $table->string('resolved_cheque_number')->nullable();
            $table->date('resolved_cheque_date')->nullable();
            $table->foreignId('tag_location_id')->nullable()->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamp('tagged_at')->nullable();
            $table->foreignId('causer_id')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cvs');
    }
};

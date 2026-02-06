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
        Schema::create('scanned_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bank_account_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete()->nullable();
            $table->string('bu')->nullable();
            $table->string('seq')->nullable();
            $table->dateTime('date')->nullable();
            $table->dateTime('posted_date')->nullable();
            $table->string('check_no');
            $table->unsignedBigInteger('branch_code')->nullable();
            $table->string('branch_name')->nullable();
            $table->decimal('amount', 20);
            $table->string('payee')->nullable();
            $table->timestamp('check_date')->nullable();
            $table->unsignedBigInteger('caused_by')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['check_no', 'account_no', 'amount']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scanned_records');
    }
};

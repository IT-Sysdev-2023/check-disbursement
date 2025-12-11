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
            $table->string('bu');
            $table->string('seq');
            $table->dateTime('date');
            $table->string('account_no');
            $table->dateTime('posted_date');
            $table->string('check_no');
            $table->unsignedBigInteger('branch_code');
            $table->string('branch_name');
            $table->decimal('amount', 20);
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

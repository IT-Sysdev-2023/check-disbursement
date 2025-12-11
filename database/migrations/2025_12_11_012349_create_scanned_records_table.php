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
            $table->unsignedBigInteger('account_no');
            $table->dateTime('posted_date');
            $table->unsignedBigInteger('check_no');
            $table->unsignedBigInteger('branch_code');
            $table->string('branch_name');
            $table->unsignedBigInteger('amount');
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

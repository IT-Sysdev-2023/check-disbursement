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
        Schema::create('assigned_check_numbers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cv_check_payment_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('check_number');
            $table->unsignedBigInteger('caused_by')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['cv_check_payment_id', 'check_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assigned_check_numbers');
    }
};

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
        Schema::create('cvs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nav_table_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('cv_number')->unique();
            $table->unsignedBigInteger('check_number');
            $table->decimal('check_amount', 20);
            $table->dateTime('check_date')->nullable();
            $table->string('payee');
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

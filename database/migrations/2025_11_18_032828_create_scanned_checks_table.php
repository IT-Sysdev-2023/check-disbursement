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
        Schema::create('scanned_checks', function (Blueprint $table) {
            $table->id();
            $table->integer('check_id');
            $table->boolean('is_scanned');
            $table->enum('status', ['released', 'forward', 'Deposit', 'cancel']);
             $table->enum('check', ['cv', 'crf']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scanned_checks');
    }
};

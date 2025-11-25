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
        Schema::create('cancelled_checks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('check_status_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->longText('reason')->nullable();
            $table->unsignedBigInteger('cancelled_by')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cancelled_checks');
    }
};

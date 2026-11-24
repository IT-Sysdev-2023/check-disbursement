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
        Schema::create('cheque_range_cancelleds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cheque_register_id')->constrained()->cascadeOnDelete();
            $table->string('old_cheque_number');
            $table->string('new_cheque_number');
            $table->string('reason');
            $table->unsignedBigInteger('caused_by')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cheque_range_cancelleds');
    }
};

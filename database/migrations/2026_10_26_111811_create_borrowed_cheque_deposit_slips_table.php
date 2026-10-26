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
        Schema::create('borrowed_cheque_deposit_slips', function (Blueprint $table) {
            $table->foreignId('borrowed_cheque_id')->constrained()->cascadeOnDelete();
            $table->foreignId('deposit_slip_id')->constrained()->cascadeOnDelete();
            $table->primary(['borrowed_cheque_id', 'deposit_slip_id']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('borrowed_cheque_deposit_slips');
    }
};

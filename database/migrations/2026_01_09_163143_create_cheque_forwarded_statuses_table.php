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
        Schema::create('cheque_forwarded_statuses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cheque_status_id')->cascadeOnUpdate()->cascadeOnDelete();
            $table->enum('status', ['released', 'cancelled'])->nullable();
            $table->string('forwarded_receivers_name')->nullable();
            $table->string('image')->nullable();
            $table->string('signature')->nullable();
            $table->string('cancelled_reason')->nullable();
            $table->unsignedBigInteger('caused_by')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['cheque_status_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cheque_forwarded_statuses');
    }
};

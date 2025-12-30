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
        Schema::create('check_statuses', function (Blueprint $table) {
            $table->id();
            $table->enum('status', ['release', 'forward', 'deposit', 'stale', 'cancel'])->nullable();
            $table->string('receivers_name')->nullable();
            $table->string('image')->nullable();
            $table->string('signature')->nullable();
            $table->string('cancelled_reason')->nullable();
            $table->unsignedBigInteger('caused_by')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
             $table->morphs('checkable');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('check_statuses');
    }
};

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
        Schema::create('borrowed_checks', function (Blueprint $table) {
            // $table->unsignedBigInteger('caused_by')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('primary_approver_id')->constrained('approvers')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('secondary_approver_id')->constrained('approvers')->cascadeOnUpdate()->cascadeOnDelete()->nullable();
            $table->foreignId('borrower_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->unsignedBigInteger('borrower_no');
            $table->string('reason');
            $table->timestamp('approved_at')->nullable();
            $table->morphs('checkable');
            $table->unique(['checkable_id', 'checkable_type']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('borrowed_checks');
    }
};

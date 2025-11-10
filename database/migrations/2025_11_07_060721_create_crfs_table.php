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
       Schema::create('crfs', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->string('company');
            $table->unsignedBigInteger('no');
            $table->string('location');
            $table->dateTime('date')->nullable();
            $table->string('paid_to');
            $table->string('particulars');
            $table->decimal('amount',20);
            $table->string('bank');
            $table->unsignedBigInteger('ck_no');
            $table->string('prepared_by');
            $table->timestamps();

            $table->unique(['filename', 'no']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crfs');
    }
};

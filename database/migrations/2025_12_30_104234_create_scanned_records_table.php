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
        //             'amount' => $amount,
        //             'account_number' => $data['account_no'] ?? null,
        //             'amount_in_words' => $data['amount_in_words'] ?? null,
        //             'bank_address' => $data['bank_address'] ?? null,
        //             'micr_number' => $data['micr_number'] ?? null,
        //             'serial_code' => $data['serial_code'] ?? null,
        //             'barcode_or_qr' => $data['barcode_or_qr'] ?? null,
        //             'account_name' => $data['account_name'] ?? null,
        //             'cheque_no' => $chequeNumber,
        //             'cheque_date' => Carbon::createFromFormat('m-d-Y', $data['date']) ?? null,
        //             'bank_account_name' => $data['bank_name'] ?? null,
        //             'caused_by' => $this->id,
        Schema::create('scanned_records', function (Blueprint $table) {
            $table->id();
            $table->string('scan_method')->nullable();
            $table->string('supplier')->nullable();
            $table->string('batch_reference')->unique();
            $table->foreignId('borrowed_cheque_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('bank_account_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('cheque_no');
            $table->decimal('amount', 20);
            $table->string('payee')->nullable();
            $table->date('cheque_date')->nullable();
            $table->string('amount_in_words')->nullable();
            $table->string('bank_address')->nullable();
            $table->string('micr_number')->nullable();
            $table->string('serial_code')->nullable();
            $table->string('barcode_or_qr')->nullable();
            $table->string('account_name')->nullable();
            $table->unsignedBigInteger('caused_by')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('doc_filename')->nullable();
            $table->timestamps();

            $table->unique(['cheque_no', 'bank_account_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scanned_records');
    }
};

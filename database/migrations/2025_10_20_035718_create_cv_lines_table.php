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
        Schema::create('cv_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nav_line_table_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete(); //new
            // $table->foreignId('cv_header_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('cv_no'); //new
            $table->string('line_no');
            $table->string('vendor_no'); //new
            $table->string('crf_no');
            $table->string('document_no');
            $table->string('gl_entry_no');
            $table->string('forwarded_amount');
            $table->string('paid_amount');
            $table->string('balance');
            $table->string('cv_status'); //new
            $table->string('document_type');
            $table->string('applies_to_doc_no');
            $table->string('invoice_no');
            $table->string('account_name');
            $table->string('company_dimension_code');
            $table->string('department_dimension_code');
            $table->string('payment_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cv_lines');
    }
};

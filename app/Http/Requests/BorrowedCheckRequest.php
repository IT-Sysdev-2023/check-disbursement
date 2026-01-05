<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BorrowedCheckRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "type" => ["required", 'in:include,exclude'],
            "ids" => ['required_if:type,include', 'array'],
            'ids.*' => ['integer'],
            "name" => ["required", "int"],
            "reason" => ["required", "string"],
            'check' => ["required", "in:cv,crf"],
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReleasingCheckRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'receiversName' => 'required|string|max:255',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'signature' => 'required|string',
            'status' => 'required|string',
        ];
    }
}

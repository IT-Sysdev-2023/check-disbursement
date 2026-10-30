<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <style>
        @page {
            margin: 15mm;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #222;
            margin: 0;
        }

        .report-header {
            text-align: center;
            margin-bottom: 25px;
        }

        .report-header h1 {
            font-size: 20px;
            font-weight: bold;
            margin: 0 0 8px;
            text-transform: uppercase;
        }

        .report-header .location {
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .report-header .report-date {
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        thead {
            display: table-header-group;
        }

        thead th {
            background-color: #e9ecef;
            font-weight: bold;
            text-align: center;
        }

        th,
        td {
            border: 1px solid #333;
            padding: 8px;
        }

        td.amount {
            text-align: right;
        }

        td.center {
            text-align: center;
        }

        tr {
            page-break-inside: avoid;
        }

        .report-details {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            margin-bottom: 20px;
            font-size: 12px;
        }

        .report-details td {
            border: none;
            text-align: left;
            vertical-align: top;
        }

        .page-break {
            page-break-before: always;
        }
    </style>
</head>

<body>

    <div class="report-header">
        <h1>Released Forwarded Cheques</h1>
        {{-- <div class="location">{{ $data['location'] ?? '-' }}</div>
        <div class="report-date">{{ $data['dateRange'] ?? '-' }}</div> --}}
    </div>

    <table class="report-details">
        <tr>
            <td style="width: 50%; border: none; padding: 0 0 8px 0;">
                <strong>Transaction Number:</strong> {{ $data['transactionNo'] ?? '-' }}
            </td>
            <td style="width: 50%; border: none; padding: 0 0 8px 0; text-align: right;">
                <strong>{{ $data['dateLabel'] }}</strong> {{ $data['dateReleased'] ?? '-' }}
            </td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th>CV No.</th>
                <th>Cheque Number</th>
                <th>Cheque Date</th>
                <th>Payee</th>
                <th>Amount</th>
            </tr>
        </thead>

        <tbody>
            @foreach ($data['cheques'] as $cheque)
                <tr>
                    <td class="center">{{ $cheque['cv_no'] }}</td>
                    <td class="center">{{ $cheque['cheque_number'] }}</td>
                    <td class="center"> {{ \Carbon\Carbon::parse($cheque['cheque_date'])->format('Y-m-d') }}</td>
                    <td>{{ $cheque['payee'] }}</td>
                    <td class="center">
                        ₱{{ number_format((float) ($cheque['cheque_amount'] ?? 0), 2) }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
    <table class="report-details signature-details">
        <tr>
            <td style="width: 50%; border: none; padding: 30px 0 0 0;">
                <strong>Received By:</strong>
            </td>
            <td style="width: 50%; border: none; padding: 30px 0 0 0;">
                <strong>Released By:</strong>
            </td>
        </tr>

        <tr>
            <td style="border: none; padding: 10px 0 0 40px;">
                <div style="text-align: center; border-bottom: 1px solid #000; padding-bottom: 3px;">
                    <div style="height: 50px;"></div>

                    <div style="text-align: center;">
                        {{ Str::upper($data['causedBy'] ?? '-') }}
                    </div>
                </div>
            </td>

            <td style="border: none; padding: 10px 0 0 40px;">
                <div style="text-align: center; border-bottom: 1px solid #000; padding-bottom: 3px;">
                    <div style="height: 50px; text-align: center;">
                        @if (!empty($data['signature']))
                            <img src="{{ $data['signature'] }}" alt="Signature"
                                style="max-height: 50px; max-width: 180px;">
                        @endif
                    </div>

                    <div style="text-align: center;">
                        {{ Str::upper($data['releasedBy'] ?? '-') }}
                    </div>
                </div>
            </td>
        </tr>
    </table>

</body>

</html>

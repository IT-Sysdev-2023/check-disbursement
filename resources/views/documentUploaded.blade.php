<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>List of Cheques with Documents</title>

    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #222;
            margin: 30px;
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

        thead th {
            background-color: #e9ecef;
            font-weight: bold;
            text-align: center;
        }

        th, td {
            border: 1px solid #333;
            padding: 8px;
        }

        td.amount {
            text-align: right;
        }

        td.center {
            text-align: center;
        }

        @media print {
            body {
                margin: 15mm;
            }

            thead {
                display: table-header-group;
            }

            tr {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>

    <div class="report-header">
        <h1>Cheques with Documents</h1>

       
    </div>
    <table class="report-details">
        <tr>
            <td style="width: 50%; border: none; padding: 0 0 10px 0;">
                <strong>Date Closed:</strong> {{ $data['date']}}
            </td>
            <td style="width: 50%; border: none; padding: 0 0 10px 0; text-align: right;">
                <strong>Closed by:</strong> {{ $data['closedBy'] }}
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
                    <td class="center">
                        {{ \Carbon\Carbon::parse($cheque['cheque_date'])->format('Y-m-d') }}
                    </td>
                    <td>{{ $cheque['payee'] }}</td>
                    <td class="amount">
                        ₱{{ number_format((float) ($cheque['cheque_amount'] ?? 0), 2) }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
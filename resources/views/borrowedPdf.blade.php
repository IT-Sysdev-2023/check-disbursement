<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Borrower Cheque Details</title>

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
        <h1>Borrower Cheque Details</h1>
        <div class="location">{{ $data['company'] }}</div>
    </div>



    <table class="report-details">
        <tr>
            <td style="width: 50%; border: none; padding: 0 0 8px 0;">
                <strong>Borrower Name:</strong> {{ $data['borrowedBy'] ?? '-' }}
            </td>
            <td style="width: 50%; border: none; padding: 0 0 8px 0; text-align: right;">
                <strong>Purpose:</strong> {{ $data['purpose'] }}
            </td>
        </tr>
        <tr>
            <td style="border: none; padding: 0;">
                <strong>Borrower No.:</strong> {{ $data['borrowerNo'] ?? '-' }}
            </td>
            <td style="width: 50%; border: none; padding: 0 0 8px 0; text-align: right;">
                <strong>Borrower Date:</strong> {{ $data['dateBorrowed'] ?? '-' }}
            </td>
        </tr>
        <tr>
            <td style="border: none; padding: 0;">
                <strong>Total Cheques:</strong> {{ $data['noOfChecks'] ?? '-' }}
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
                    <td class="center">{{ $cheque['cv_no'] ?? $cheque['crf_no'] }}</td>
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
    <table class="report-details">
        <tr>
            <td style="width: 50%; border: none; padding: 10px 0 0 0;">
                <strong>Prepared By:</strong> {{ $data['releasedBy'] ?? '-' }}
            </td>
        </tr>
    </table>
</body>

</html>

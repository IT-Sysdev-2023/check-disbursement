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

        .page-break {
            page-break-before: always;
        }
    </style>
</head>

<body>

    <div class="report-header">
        <h1>{{ $data['cheques']['title'] ?? '-' }}</h1>
        <div class="location">{{ $data['cheques']['location'] ?? '-' }}</div>
        <div class="report-date">{{ $data['cheques']['date'] ?? '-' }}</div>
    </div>

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
            @foreach ($data['cheques']['data'] as $cheque)
                <tr>
                    <td class="center">{{ $cheque['cv_number'] }}</td>
                    <td class="center">{{ $cheque['cheque_number'] }}</td>
                    <td class="center">{{ $cheque['cheque_date'] }}</td>
                    <td>{{ $cheque['payee'] }}</td>
                    <td class="center">
                        {{ $cheque['cheque_amount']  }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{-- Start the included content on a new page --}}
    <div class="page-break"></div>

    @include('releasingPdf', [
        'data' => $data,
    ])

</body>

</html>

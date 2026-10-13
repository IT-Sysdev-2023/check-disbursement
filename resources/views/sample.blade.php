```blade
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>List of Forwarded Cheques</title>

    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
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
        <h1>List of Forwarded Cheques</h1>

        <div class="location">Cebu</div>

        <div class="report-date">
            October 13, 2026
        </div>
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
            <tr>
                <td class="center">CV-2026-001</td>
                <td class="center">001245</td>
                <td class="center">2026-09-15</td>
                <td>ABC Trading Corporation</td>
                <td class="amount">₱25,000.00</td>
            </tr>

            <tr>
                <td class="center">CV-2026-002</td>
                <td class="center">001246</td>
                <td class="center">2026-09-20</td>
                <td>Juan Dela Cruz</td>
                <td class="amount">₱18,500.00</td>
            </tr>

            <tr>
                <td class="center">CV-2026-003</td>
                <td class="center">001247</td>
                <td class="center">2026-09-25</td>
                <td>XYZ Construction Supplies</td>
                <td class="amount">₱42,750.00</td>
            </tr>

            <tr>
                <td class="center">CV-2026-004</td>
                <td class="center">001248</td>
                <td class="center">2026-10-01</td>
                <td>Maria Santos</td>
                <td class="amount">₱12,000.00</td>
            </tr>

            <tr>
                <td class="center">CV-2026-005</td>
                <td class="center">001249</td>
                <td class="center">2026-10-05</td>
                <td>DEF Industrial Corporation</td>
                <td class="amount">₱36,200.00</td>
            </tr>
        </tbody>
    </table>

</body>
</html>
```
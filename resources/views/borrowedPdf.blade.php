{{-- <style>
    .document-container {
        max-width: 600px;
        margin: 20px auto;
        padding: 40px;
        font-family: Arial, sans-serif;
        color: #000;
    }

    .header {
        text-align: center;
        margin-bottom: 30px;
    }

    .header h1 {
        margin: 0;
        font-size: 24px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .header p {
        margin: 5px 0;
        font-size: 20px;
        font-weight: bold;
    }

    .info-section {
        margin-bottom: 30px;
    }

    .info-row {
        display: flex;
        margin-bottom: 10px;
        font-size: 18px;
    }

    .label-fixed {
        width: 600px;
    }

    .value-bold {
        font-weight: bold;
    }

  .form-group {
    display: flex;
    align-items: center;   /* vertical alignment */
    flex-wrap: nowrap;     /* prevents breaking into another row */
    margin-bottom: 15px;
}

  .form-label {
    width: 180px;
    font-size: 18px;
    flex-shrink: 0; /* prevents label from shrinking */
}

    .form-box {
        flex: 1;
        border: 2px solid #ccc;
        padding: 12px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;

        /* THE DYNAMIC FIXES: */
        height: auto;
        /* Allows the box to grow vertically */
        min-height: 30px;
        /* Minimum size if data is empty */
        word-wrap: break-word;
        /* Prevents long strings from breaking layout */
        overflow: hidden;
        /* Ensures no scrollbars appear on the printout */
    }

    .form-box2 {
        flex: 1;
        padding: 12px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;

        /* THE DYNAMIC FIXES: */
        height: auto;
        /* Allows the box to grow vertically */
        min-height: 30px;
        /* Minimum size if data is empty */
        word-wrap: break-word;
        /* Prevents long strings from breaking layout */
        overflow: hidden;
        /* Ensures no scrollbars appear on the printout */
    }

    .check-list-item {
        margin-bottom: 4px;
    }

    .check-list-item:last-child {
        margin-bottom: 0;
    }
</style>

<div class="document-container">
    <div class="header">
        <h1>Borrower Cheque Details</h1>
        <p>{{ $data['company'] }}</p>
    </div>

    <div class="info-section">
        <div class="info-row">
            <div class="label-fixed">
                Borrower Name:
                <span class="value-bold">{{ $data['borrowedBy'] ?? '-' }}</span>
            </div>
        </div>
        <div class="info-row">
            <div class="label-fixed">
                Purpose:
                <span class="value-bold">{{ $data['purpose'] }}</span>
            </div>
        </div>
    </div>


    <div class="form-content">

        <div class="form-group">
            <div class="form-label">Borrower No. :</div>
            <div class="form-box" style="letter-spacing: 4px;">
                {{ $data['borrowerNo'] ?? '-' }}
            </div>
        </div>

        <div class="form-group">
            <div class="form-label">Borrowed Date :</div>
            <div class="form-box">
                {{ $data['dateBorrowed'] ?? '-' }}
            </div>
        </div>

        <div class="form-group">
            <div class="form-label">Number of Cheques:</div>
            <div class="form-box">
                {{ $data['noOfChecks'] ?? '-' }}
            </div>
        </div>

        <div class="form-group">
            <div class="form-label">Cheque Number:</div>
            <div class="form-box">
                @php
                    $chunks = array_chunk($data['chequeNumbers'] ?? [], 4);
                @endphp

                <table style="width:100%; text-align:center;">
                    <tr>
                        @foreach ($chunks as $chunk)
                            <td style="vertical-align:top;">
                                @foreach ($chunk as $number)
                                    <div class="check-list-item">{{ $number }}</div>
                                @endforeach
                            </td>
                        @endforeach
                    </tr>
                </table>
            </div>
        </div>
        <div class="form-group">
            <div class="form-label">Received by:</div>
            <div class="form-box2">
                {{ $data['borrowedBy'] ?? '-' }}
            </div>
        </div>
        <div class="form-group">
            <div class="form-label">Released by:</div>
            <div class="form-box2">
                {{ $data['releasedBy'] ?? '-' }}
            </div>
        </div>

    </div>
</div> --}}
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

</body>

</html>

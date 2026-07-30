<style>
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
</div>

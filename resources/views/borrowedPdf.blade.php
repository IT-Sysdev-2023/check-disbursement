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
        /* Aligns label to the top of the box as it grows */
        align-items: flex-start; 
        margin-bottom: 15px;
    }

    .form-label {
        width: 180px;
        font-size: 18px;
        /* Matches the padding of the box to keep text level */
        padding-top: 12px; 
    }
    .form-box {
        flex: 1;
        border: 2px solid #ccc;
        padding: 12px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        
        /* THE DYNAMIC FIXES: */
        height: auto;           /* Allows the box to grow vertically */
        min-height: 50px;       /* Minimum size if data is empty */
        word-wrap: break-word;  /* Prevents long strings from breaking layout */
        overflow: hidden;       /* Ensures no scrollbars appear on the printout */
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
        <h1>Borrower Check Details</h1>
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
            <span class="value-bold">{{ $purpose ?? 'For Signature' }}</span>
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
            <div class="form-label">Number of Check:</div>
            <div class="form-box">
                {{ $data['noOfChecks'] ?? '-' }}
            </div>
        </div>

       <div class="form-group">
    <div class="form-label">Check Number:</div>
    <div class="form-box">
        @if(isset($data['chequeNumbers']) && count($data['chequeNumbers']) > 0)
            @foreach($data['chequeNumbers'] as $number)
                <div class="check-list-item">{{ $number }}</div>
            @endforeach
        @else
            {{-- Default placeholders if empty --}}
            <div>-</div>
            <div>-</div>
            <div>-</div>
        @endif
    </div>
</div>

    </div>
</div>
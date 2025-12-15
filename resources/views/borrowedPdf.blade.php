<!doctype html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Invoice</title>
</head>
<body>
    <table class="w-full">
        <tr>
             <th style="text-align: left;"><h2>Date Borrowed: </h2></th>
            <td><h3> {{  $data['dateBorrowed'] }}</h3></td>
        </tr>
    </table>
 
   @foreach($data['items'] as $item)
    <table class="products margin-top" style="margin-bottom: 20px;">
        <tr>
            <th style="text-align: left;">Borrower No:</th>
            <td>{{ $item['borrowerNo'] }}</td>
        </tr>
        <tr>
            <th style="text-align: left;">Number of Check:</th>
            <td>{{ $item['noOfChecks'] }}</td>
        </tr>
        <tr>
            <th style="text-align: left;">Borrowed By:</th>
            <td>{{ $item['borrowedBy'] }}</td>
        </tr>
        <tr>
            <th style="text-align: left;">Company:</th>
            <td>{{ $item['company'] }}</td>
        </tr>
        <tr>
            <th style="text-align: left;">Purpose:</th>
            <td>{{ $item['purpose'] ?? '-' }}</td>
        </tr>
    </table>
@endforeach

</body>
</html>
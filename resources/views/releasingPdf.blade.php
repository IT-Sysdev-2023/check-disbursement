<!doctype html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Check Releasing</title>
</head>
<body>
    <table class="w-full">
        <tr>
             <th style="text-align: left;"><h2>Transaction No: </h2></th>
            <td><h3> {{  $data['transactionNo'] }}</h3></td>
        </tr>
    </table>
 
   @foreach($data['items'] as $item)
    <table class="products margin-top" style="margin-bottom: 20px;">
        <tr>
            <th style="text-align: left;">{{ $item['dateLabel'] }}</th>
            <td>{{ $item['dateReleased'] }}</td>
        </tr>
        <tr>
            <th style="text-align: left;">{{ $item['causedLabel'] }}</th>
            <td>{{ $item['causedBy'] }}</td>
        </tr>
        <tr>
            <th style="text-align: left;">{{ $item['receivedLabel'] }}</th>
            <td>{{ $item['receivedBy'] }}</td>
        </tr>
        <tr>
            <th style="text-align: left;">Company:</th>
            <td>{{ $item['company'] }}</td>
        </tr>
        <tr>
            <th style="text-align: left;">Location:</th>
            <td>{{ $item['location'] ?? '-' }}</td>
        </tr>
    </table>
@endforeach

</body>
</html>
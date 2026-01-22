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
            <th style="text-align: left;">Date Forwarded:</th>
            <td>{{ $item['dateForwarded'] }}</td>
        </tr>
        <tr>
            <th style="text-align: left;">Forwarded By:</th>
            <td>{{ $item['forwardedBy'] }}</td>
        </tr>
        <tr>
            <th style="text-align: left;">Date Received:</th>
            <td>{{ $item['dateReceived'] }}</td>
        </tr>
        <tr>
            <th style="text-align: left;">Received By:</th>
            <td>{{ $item['receivedBy'] }}</td>
        </tr>
    </table>
@endforeach

</body>
</html>
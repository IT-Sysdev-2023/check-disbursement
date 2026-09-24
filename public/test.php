<?php
// test_driver17.php
$serverName = "172.16.161.11,1433";
$connectionInfo = [
    "Database"               => "CARMEN AGRI FARM",
    "UID"                    => "super",
    "PWD"                    => "fsasya1941",
    "Encrypt"                => "yes",
    "TrustServerCertificate" => true,
    "Driver"                 => "ODBC Driver 17 for SQL Server"
];

$conn = sqlsrv_connect($serverName, $connectionInfo);

if ($conn) {
    echo "Connected successfully using ODBC Driver 17!";
    sqlsrv_close($conn);
} else {
    echo "Failed:\n";
    print_r(sqlsrv_errors());
}
<?php
$host = 'localhost';
$username = 'your_mysql_username';
$password = 'your_mysql_password';
$database = 'your_database_name';

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die('Σφάλμα κατά τη σύνδεση στη βάση δεδομένων: ' . $conn->connect_error);
}

// Εκτελούμε το ερώτημα για την επιλογή των δεδομένων από τη βάση δεδομένων
$query = 'SELECT * FROM products';
$result = $conn->query($query);

if (!$result) {
    die('Σφάλμα κατά την εκτέλεση του ερωτήματος: ' . $conn->error);
}

// Ανακτούμε τα δεδομένα από τη βάση και τα επιστρέφουμε σε JSON μορφή
$data = array();
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}
echo json_encode($data);

$conn->close();
?>

<?php



// Σύνδεση με τη βάση δεδομένων
$servername = "localhost";
$username = "root"; // Το όνομα χρήστη της βάσης δεδομένων
$password = ""; // Ο κωδικός πρόσβασης της βάσης δεδομένων
$dbname = "my_page_db"; // Το όνομα της βάσης δεδομένων που δημιουργήσαμε

// Δημιουργία σύνδεσης
$conn = new mysqli($servername, $username, $password, $dbname);

// Έλεγχος σύνδεσης
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
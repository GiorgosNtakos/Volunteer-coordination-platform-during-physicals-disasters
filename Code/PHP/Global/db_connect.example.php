<?php
// Database configuration (example/template)
// Σύνδεση με τη βάση δεδομένων
$servername = "localhost";
$username = "your_database_user"; // Το όνομα χρήστη της βάσης δεδομένων
$password = "your_database_password"; // Ο κωδικός πρόσβασης της βάσης δεδομένων
$dbname = "your_database_user"; // Το όνομα της βάσης δεδομένων που δημιουργήσαμε

// Δημιουργία σύνδεσης
$conn = new mysqli($servername, $username, $password, $dbname);

// Έλεγχος σύνδεσης
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
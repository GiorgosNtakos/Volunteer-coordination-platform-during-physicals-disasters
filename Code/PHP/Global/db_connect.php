<?php

// Σύνδεση με τη βάση δεδομένων
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "my_sql_db";

// Δημιουργία σύνδεσης
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
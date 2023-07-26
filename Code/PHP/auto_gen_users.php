<?php
header('Access-Control-Allow-Origin: *');
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

// Έλεγχος αν διαγράφονται όλοι οι χρήστες
if ($num_users == 0) {
    // Εάν διαγράφονται όλοι οι χρήστες, μηδενίζουμε το πρωτεύον κλειδί (id)
    $reset_auto_increment_sql = "ALTER TABLE users AUTO_INCREMENT = 1";
    $conn->query($reset_auto_increment_sql);
}

// Αριθμός χρηστών που θέλουμε να δημιουργήσουμε
$num_users = 6;

// Προετοιμασία ενός μεγάλου INSERT ερωτήματος για bulk insert
echo "MPHKE";
$sql = "INSERT INTO users (username, email, password) VALUES ";
for ($i = 0; $i < $num_users; $i++) {
    $username = "user" . ($i + 1);
    $email = $username . "@example.com";
    $password = password_hash("P@ssw0rd".$i.$username, PASSWORD_DEFAULT); // Κωδικοποίηση του κωδικού πρόσβασης

    // Προσθέτουμε τα δεδομένα του κάθε χρήστη στο ερώτημα INSERT
    $sql .= "('$username', '$email', '$password'),";
    echo "To i einai iso me".$i;
}
echo "BGHKE";
// Αφαιρούμε το τελευταίο κόμμα από το ερώτημα INSERT
$sql = rtrim($sql, ",");

// Εκτέλεση του bulk insert
if ($conn->multi_query($sql) === TRUE) {
    echo "Bulk insert successful!";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Κλείσιμο σύνδεσης με τη βάση δεδομένων
$conn->close();
?>

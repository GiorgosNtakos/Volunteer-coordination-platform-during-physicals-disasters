<?php

require 'db_connect.php';
require 'vendor\autoload.php';

use Ramsey\Uuid\Uuid;


// Αριθμός χρηστών που θέλουμε να δημιουργήσουμε
$num_users = 6;

// Προετοιμασία ενός μεγάλου INSERT ερωτήματος για bulk insert
echo "MPHKE";
$sql = "INSERT INTO users (user_id, username, email, password) VALUES ";
for ($i = 0; $i < $num_users; $i++) {
    $uuid = Uuid::uuid4();
    $user_id = $uuid->toString();
    $username = "user" . ($i + 1);
    $email = $username . "@example.com";
    $password = password_hash("P@ssw0rd".$i.$username, PASSWORD_DEFAULT); // Κωδικοποίηση του κωδικού πρόσβασης

    // Προσθέτουμε τα δεδομένα του κάθε χρήστη στο ερώτημα INSERT
    $sql .= "('$user_id', '$username', '$email', '$password'),";
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

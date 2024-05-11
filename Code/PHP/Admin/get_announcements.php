<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

// Ερώτημα SQL για ανάκτηση του id των ανακοινώσεων με στοιχεία από τον πίνακα Tasks
$sql = "SELECT Announcements.id, Items.name AS item_name, Announcements.quantity, Announcements.gathered, Announcements.status 
        FROM Announcements
        INNER JOIN Items ON Announcements.item_id = Items.id";

$result = $conn->query($sql);

// Έλεγχος για ενδεχόμενο SQL σφάλμα
if ($conn->error) {
    die("SQL error: " . $conn->error);
}

// Αν έχουμε αποτελέσματα
if ($result->num_rows > 0) {
    $announcements = array();
    while ($row = $result->fetch_assoc()) {
        $announcements[] = $row;
    }

    // Έλεγχος για ενδεχόμενο σφάλμα κωδικοποίησης JSON
    if ($conn->error) {
        $error_message = array("error" => "SQL error: " . $conn->error);
        echo json_encode($error_message);
        exit();
    }

    echo json_encode($announcements); // Επιστροφή των ανακοινώσεων σε μορφή JSON
} else {
    echo json_encode(array("message" => "0 results"));
}

$conn->close();
?>

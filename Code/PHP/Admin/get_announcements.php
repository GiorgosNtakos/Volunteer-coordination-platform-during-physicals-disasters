<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

// Ερώτημα SQL για ανάκτηση του id των ανακοινώσεων με στοιχεία από τον πίνακα Tasks
$sql = "SELECT Announcements.id, Items.name AS item_name, Tasks.quantity AS task_quantity,
        Tasks.type AS task_type, Tasks.status AS task_status 
        FROM Announcements 
        INNER JOIN Tasks ON Announcements.task_id = Tasks.id
        INNER JOIN Items ON Tasks.item_id = Items.id";

$result = $conn->query($sql);
mysqli_error($conn);

// Αν έχουμε αποτελέσματα
if ($result->num_rows > 0) {
    $announcements = array();
    while($row = $result->fetch_assoc()) {
        $announcements[] = $row;
    }
    echo json_encode($announcements); // Επιστροφή των ανακοινώσεων σε μορφή JSON
} else {
    echo "0 results";
}
$conn->close();
?>

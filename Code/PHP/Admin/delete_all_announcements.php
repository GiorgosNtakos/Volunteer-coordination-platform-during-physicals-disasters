<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: DELETE");
require '../Global/db_connect.php';
$conn->set_charset("utf8");

// Διαγραφή όλων των ανακοινώσεων
$sql = "DELETE FROM Announcements";
$result = $conn->query($sql);

if ($result) {
    echo json_encode(["message" => "Οι ανακοινώσεις διαγράφηκαν επιτυχώς."]);
} else {
    echo json_encode(["message" => "Η διαγραφή απέτυχε."]);
}

$conn->close();

?>

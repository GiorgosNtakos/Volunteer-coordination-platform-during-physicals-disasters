<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

// Ερώτημα SQL για ανάκτηση όλων των Tasks
$sql = "SELECT Tasks.*, Items.name AS item_name, Users.username AS username
        FROM Tasks
        INNER JOIN Items ON Tasks.item_id = Items.id
        INNER JOIN Users ON Tasks.user_id = Users.id";

$result = $conn->query($sql);

$tasks = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Τα δεδομένα του κάθε task ---> $tasks
        $tasks[] = $row;
    }
    echo json_encode($tasks); // Επιστροφή των δεδομένων ως JSON
} else {
    echo "0 results";
}
$conn->close();
?>

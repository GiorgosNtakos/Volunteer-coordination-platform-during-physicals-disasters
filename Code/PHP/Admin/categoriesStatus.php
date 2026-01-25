<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Κατάσταση κατηγοριών
    $categoriesStatus = array();

    // Επιλέξτε τα δεδομένα από τον πίνακα categories
    $stmt = $conn->prepare("SELECT id, active FROM categories");
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $categoriesStatus[$row["id"]] = $row["active"];
        }
    }
    echo json_encode($categoriesStatus);
} else {
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

$stmt->close();
$conn->close();
?>

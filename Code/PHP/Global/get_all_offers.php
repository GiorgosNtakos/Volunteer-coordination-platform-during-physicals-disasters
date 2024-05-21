<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Replace with the real path to your database connection file
require 'db_connect.php'; 
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $type = 'Offer';

    $sql = "SELECT tasks.id, tasks.quantity, tasks.status, tasks.created_at, tasks.updated_at, items.name, users.full_name, users.phone, users.street, users.number, users.town,
            users.location_lat, users.location_lon,
            vehicles.name AS vehicle_name 
            FROM tasks 
            LEFT JOIN users ON tasks.user_id = users.id 
            LEFT JOIN vehicles ON tasks.vehicle_id = vehicles.id
            LEFT JOIN items ON tasks.item_id = items.id
            WHERE tasks.type = ?";

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        // Preparation fails, return an error
        error_log("Prepare failed: " . $conn->error);
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Failed to prepare the SQL statement."));
        exit();
    }

    $stmt->bind_param("s", $type);
    if (!$stmt->execute()) {
        // Execution fails, return an error
        error_log("Execute failed: " . $stmt->error);
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Failed to execute the SQL statement."));
        exit();
    }

    $result = $stmt->get_result();
    if ($result && $result->num_rows > 0) {
        $offers = array();
        while ($row = $result->fetch_assoc()) {
            $offers[] = $row;
        }
        http_response_code(200);
        echo json_encode(array("status" => "success", "offers" => $offers));
    } else if ($result->num_rows === 0) {
        http_response_code(200);
        echo json_encode(array("status" => "success_but_empty", "message" => "No pending offers found."));
    } else {
        http_response_code(500);
        echo json_encode(array("status" => "server_error", "message" => "Error retrieving offers."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("status" => "wrong_method_405", "message" => "Invalid request method."));
}

$stmt->close();
$conn->close();
?>

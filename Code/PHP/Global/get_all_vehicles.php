<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require 'db_connect.php'; // Ensure this points to the correct database connection script
$conn->set_charset("utf8");

$sql = "SELECT v.*, t.id AS task_id, t.type AS task_type, t.status AS task_status, 
        u.username, u.phone, u.full_name, u.location_lat AS user_location_lat, u.location_lon  AS user_location_lon
        FROM Vehicles v
        LEFT JOIN Tasks t ON v.id = t.vehicle_id
        LEFT JOIN Users u ON t.user_id = u.id";

$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

$vehicles = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $vehicle_id = $row['id'];
        if (!isset($vehicles[$vehicle_id])) {
            $vehicles[$vehicle_id] = [
                "id" => $vehicle_id,
                "name" => $row['name'],
                "street" => $row['street'],
                "number" => $row['number'],
                "town" => $row['town'],
                "location_lat" => $row['location_lat'],
                "location_lon" => $row['location_lon'],
                "assigned_tasks" => $row['assigned_tasks'],
                "tasks" => []
            ];
        }
        if (isset($row['task_id'])) {
            $vehicles[$vehicle_id]['tasks'][] = [
                "task_id" => $row['task_id'],
                "task_type" => $row['task_type'],
                "task_status" => $row['task_status'],
                "username" => $row['username'],
                "phone" => $row['phone'],
                "full_name" => $row['full_name'],
                "location_lat" => $row['user_location_lat'],
                "location_lon" => $row['user_location_lon']
            ];
        }
    }
    $response = array(
        "status" => "success",
        "message" => "Successful retrieval of available vehicles from the database",
        "vehicles" => array_values($vehicles)
    );
} else {
    http_response_code(200);
    $response = array("status" => "success_but_empty", "message" => "No vehicles available.");
}

echo json_encode($response);
$stmt->close();
$conn->close();
?>

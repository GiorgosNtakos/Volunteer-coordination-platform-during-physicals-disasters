<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
session_start();
require 'db_connect.php';
$conn->set_charset("utf8");

$response = array();

if (isset($_SESSION['user_auth'])) {
    $username = $_SESSION['user_auth']['username'];

    // Fetch rescuer's data along with vehicle location
    $sql = "
        SELECT u.username, v.location_lat, v.location_lon 
        FROM Users u
        JOIN VehicleAssignments va ON u.id = va.user_id
        JOIN Vehicles v ON va.vehicle_id = v.id
        WHERE u.username = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $rescuer = $result->fetch_assoc();
        $stmt->close();
    } else {
        error_log("Failed to prepare statement: " . $conn->error);
        echo json_encode(array("status" => "error", "message" => "Failed to fetch rescuer data"));
        http_response_code(500);
        exit();
    }

    // Fetch base location
    $sql = "SELECT location_lat, location_lon FROM Warehouse LIMIT 1";
    $result = $conn->query($sql);
    if ($result) {
        $base = $result->fetch_assoc();
    } else {
        error_log("Failed to query base location: " . $conn->error);
        echo json_encode(array("status" => "error", "message" => "Failed to fetch base location"));
        http_response_code(500);
        exit();
    }

    // Fetch unassigned tasks
    $sql =  "
        SELECT t.id, t.type, u.location_lat, u.location_lon 
        FROM Tasks t 
        JOIN Users u ON t.user_id = u.id 
        WHERE t.status = 'pending' ";
    $result = $conn->query($sql);
    if ($result) {
        $unassignedTasks = $result->fetch_all(MYSQLI_ASSOC);
    } else {
        error_log("Failed to query unassigned tasks: " . $conn->error);
        echo json_encode(array("status" => "error", "message" => "Failed to fetch unassigned tasks"));
        http_response_code(500);
        exit();
    }

    // Fetch tasks assigned to the rescuer's vehicle
    $sql = "
        SELECT t.id, t.type, u.location_lat, u.location_lon, v.location_lat AS vehicle_lat, v.location_lon AS vehicle_lon
        FROM Tasks t 
        JOIN VehicleAssignments va ON t.vehicle_id = va.vehicle_id 
        JOIN Vehicles v ON va.vehicle_id = v.id 
        JOIN Users u ON t.user_id = u.id 
        WHERE va.user_id = (SELECT id FROM Users WHERE username = ?)";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $assignedTasks = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
    } else {
        error_log("Failed to prepare statement for assigned tasks: " . $conn->error);
        echo json_encode(array("status" => "error", "message" => "Failed to fetch assigned tasks"));
        http_response_code(500);
        exit();
    }

    $response = array(
        "status" => "success",
        "rescuer" => $rescuer,
        "base" => $base,
        "unassignedTasks" => $unassignedTasks,
        "assignedTasks" => $assignedTasks
    );

    http_response_code(200);
} else {
    $response = array("status" => "unauthorized", "message" => "User is not authenticated.");
    http_response_code(401);
}

echo json_encode($response);
$conn->close();
?>

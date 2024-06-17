<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
session_start();
require '../Global/db_connect.php';
$conn->set_charset("utf8");

$response = array();

if (isset($_SESSION['user_auth'])) {
    $user_id = $_SESSION['user_auth']['id'];
    error_log("User ID: " . $user_id); // Log the user ID

    // Fetch rescuer's data along with vehicle location
    $sql = "
        SELECT v.name, v.street, v.number, v.town, v.assigned_tasks, v.assigned_rescuers, u.username, v.location_lat, v.location_lon 
        FROM Users u
        JOIN Vehicleassignments va ON u.id = va.user_id
        JOIN Vehicles v ON va.vehicle_id = v.id
        WHERE u.id = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param('s', $user_id);
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
    $sql = "SELECT street, number, town, location_lat, location_lon FROM Warehouse LIMIT 1";
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
        SELECT t.id, t.type, t.created_at, t.updated_at, t.quantity, u.location_lat, u.location_lon , u.full_name, u.phone, u.town, u.number, u.street,
        i.name as item_name
        FROM Tasks t
        JOIN items i ON t.item_id = i.id 
        JOIN Users u ON t.user_id = u.id 
        WHERE t.status = 'pending' ";
    $result = $conn->query($sql);
    if ($result) {
        $unassignedTasks = $result->fetch_all(MYSQLI_ASSOC);
        error_log("Unassigned Tasks: " . json_encode($unassignedTasks));
    } else {
        error_log("Failed to query unassigned tasks: " . $conn->error);
        echo json_encode(array("status" => "error", "message" => "Failed to fetch unassigned tasks"));
        http_response_code(500);
        exit();
    }

    // Fetch tasks assigned to the rescuer's vehicle
    $sql = "
        SELECT t.id, t.type,  t.created_at, t.updated_at as accepted_at, t.quantity, u.location_lat, u.location_lon,u.full_name, u.phone, u.town, u.number, u.street,
         v.location_lat AS vehicle_lat,  v.location_lon AS vehicle_lon, i.name as item_name
        FROM Tasks t
        JOIN items i ON t.item_id = i.id 
        JOIN Vehicleassignments va ON t.vehicle_id = va.vehicle_id 
        JOIN Vehicles v ON t.vehicle_id = v.id 
        JOIN Users u ON t.user_id = u.id 
        WHERE va.user_id = ? AND t.status = 'accepted'";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param('s', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $assignedTasks = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        error_log("Assigned Tasks: " . json_encode($assignedTasks));
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
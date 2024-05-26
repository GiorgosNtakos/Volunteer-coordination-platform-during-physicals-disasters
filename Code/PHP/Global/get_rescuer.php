<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
session_start();
require '../Global/db_connect.php';
$conn->set_charset("utf8");

$response = array();

if (isset($_SESSION['user_auth'])) {
    $username = $_SESSION['user_auth']['username'];

    $sql = "SELECT username, location_lat, location_lon FROM Users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $response = array(
            "status" => "success",
            "username" => $row['username'],
            "location_lat" => $row['location_lat'],
            "location_lon" => $row['location_lon']
        );
        http_response_code(200);
    } else {
        $response = array("status" => "not_found", "message" => "Rescuer not found.");
        http_response_code(404);
    }

    $stmt->close();
} else {
    $response = array("status" => "unauthorized", "message" => "User is not authenticated.");
    http_response_code(401);
}

echo json_encode($response);
$conn->close();
?>

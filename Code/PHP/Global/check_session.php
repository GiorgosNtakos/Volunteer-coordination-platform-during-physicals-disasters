<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
session_start();

$response = array();

if (isset($_SESSION['user_auth'])) {
    $response = array(
        "status" => "success",
        "username" => $_SESSION['user_auth']['username'],
        "email" => $_SESSION['user_auth']['email'],
        "type" => $_SESSION['user_auth']['type'],
        "image_path" => $_SESSION['user_auth']['image_path'],
        "login_time" => $_SESSION['user_auth']['login_time']
    );
    http_response_code(200);
} else {
    $response = array("status" => "unauthorized", "message" => "User is not authenticated.");
    http_response_code(401);
}

echo json_encode($response);
?>

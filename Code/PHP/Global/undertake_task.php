<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
session_start();

// Adjust the path to 'db_connection.php' according to your directory structure
require 'db_connect.php'; 

$conn->set_charset("utf8");

$response = array();

if (isset($_SESSION['user_auth'])) {
    $username = $_SESSION['user_auth']['username'];

    if (isset($_POST['task_id']) && isset($_POST['task_type'])) {
        $task_id = $_POST['task_id'];
        $task_type = $_POST['task_type'];

        // Get the rescuer's vehicle_id
        $sql = "SELECT va.vehicle_id 
                FROM VehicleAssignments va 
                JOIN Users u ON va.user_id = u.id 
                WHERE u.username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $vehicle_id = $row['vehicle_id'];

            // Update the task to assign it to the rescuer's vehicle
            $sql = "UPDATE Tasks 
                    SET status = 'accepted', vehicle_id = ?, updated_at = NOW() 
                    WHERE id = ? AND status = 'pending'";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('ss', $vehicle_id, $task_id);

            if ($stmt->execute()) {
                $response['status'] = 'success';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Failed to update task.';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Rescuer vehicle not found.';
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Invalid task data.';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'User not authenticated.';
}

echo json_encode($response);
?>

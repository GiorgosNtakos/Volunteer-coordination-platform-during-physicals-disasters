<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
session_start();

require '../Global/db_connect.php';

$conn->set_charset("utf8");

$response = array();

if (isset($_SESSION['user_auth'])) {
    $user_id = $_SESSION['user_auth']['id'];

    if (isset($_POST['task_id'])) {
        $task_id = $_POST['task_id'];

        // Check if the task exists and is assigned to the rescuer
        $sql = "SELECT Tasks.id 
                FROM Tasks 
                INNER JOIN Vehicleassignments ON Vehicleassignments.vehicle_id = Tasks.vehicle_id 
                WHERE Tasks.id = ? AND Tasks.status = 'accepted' AND Vehicleassignments.user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $task_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Update the task status to 'pending' and remove the user_id
            $sql = "UPDATE Tasks SET status = 'pending', vehicle_id = NULL, updated_at = NOW() WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('s', $task_id);

            if ($stmt->execute()) {
                $response['status'] = 'success';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Failed to update task.';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Task not found or not assigned to the rescuer.';
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
<?php
session_start();
require 'db_connection.php'; // Adjust the path as necessary

$response = array('status' => 'error', 'message' => 'Unknown error occurred.');

if (isset($_SESSION['user_id']) && isset($_POST['task_id']) && isset($_POST['task_type'])) {
    $userId = $_SESSION['user_id'];
    $taskId = $_POST['task_id'];
    $taskType = $_POST['task_type'];

    // Fetch the vehicle assigned to the rescuer
    $sql = "SELECT vehicle_id FROM VehicleAssignments WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $vehicleId = $row['vehicle_id'];

        // Update the task with the vehicle_id
        $updateSql = "UPDATE Tasks SET vehicle_id = ?, status = 'accepted' WHERE id = ? AND type = ? ";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bind_param('sss', $vehicleId, $taskId, $taskType);
        $updateStmt->execute();

        if ($updateStmt->affected_rows > 0) {
            $response['status'] = 'success';
            $response['message'] = 'Task successfully undertaken.';
        } else {
            $response['message'] = 'Failed to update task. It might be already undertaken by another vehicle.';
        }

        $updateStmt->close();
    } else {
        $response['message'] = 'No vehicle assigned to the rescuer.';
    }

    $stmt->close();
} else {
    $response['message'] = 'Invalid request.';
}

echo json_encode($response);
?>

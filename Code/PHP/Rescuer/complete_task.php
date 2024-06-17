<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
session_start();

require '../Global/db_connect.php';

$conn->set_charset("utf8");

$response = array();

if (isset($_SESSION['user_auth'])) {
    $user_id = $_SESSION['user_auth']['id'];
    error_log("Username: " . $user_id);

    if (isset($_POST['task_id'])) {
        $task_id = $_POST['task_id'];
        error_log("Task ID: " . $task_id);

        // Check if rescuer exists
        $rescuer_sql = "SELECT vehicles.*
                        FROM vehicles
                        JOIN VehicleAssignments ON vehicles.id = VehicleAssignments.vehicle_id
                        JOIN users ON VehicleAssignments.user_id = users.id
                        WHERE users.id = ? AND users.type = 'Rescuer'";
        if ($rescuer_stmt = $conn->prepare($rescuer_sql)) {
            $rescuer_stmt->bind_param('s', $user_id);
            if ($rescuer_stmt->execute()) {
                $rescuer_result = $rescuer_stmt->get_result();
                if ($rescuer_result->num_rows > 0) {
                    $rescuer = $rescuer_result->fetch_assoc();
                    error_log("Rescuer found: " . print_r($rescuer, true));

                    // Check if task exists and is accepted
                    $task_sql = "SELECT * FROM Tasks WHERE id = ? AND status = 'accepted'";
                    if ($task_stmt = $conn->prepare($task_sql)) {
                        $task_stmt->bind_param('s', $task_id);
                        if ($task_stmt->execute()) {
                            $task_result = $task_stmt->get_result();
                            if ($task_result->num_rows > 0) {
                                $task = $task_result->fetch_assoc();
                                error_log("Task found: " . print_r($task, true));

                                // Check user associated with the task
                                $user_sql = "SELECT * FROM Users WHERE id = ?";
                                if ($user_stmt = $conn->prepare($user_sql)) {
                                    $user_stmt->bind_param('s', $task['user_id']);
                                    if ($user_stmt->execute()) {
                                        $user_result = $user_stmt->get_result();
                                        if ($user_result->num_rows > 0) {
                                            $task_user = $user_result->fetch_assoc();
                                            error_log("Task User found: " . print_r($task_user, true));

                                            // Calculate distance
                                            $distance = haversineGreatCircleDistance(
                                                $rescuer['location_lat'],
                                                $rescuer['location_lon'],
                                                $task_user['location_lat'],
                                                $task_user['location_lon']
                                            );

                                            error_log("Distance: " . $distance);

                                            if ($distance <= 0.05) { // 50 meters
                                                // Update task status to 'completed'
                                                $update_sql = "UPDATE Tasks SET status = 'completed' WHERE id = ?";
                                                if ($update_stmt = $conn->prepare($update_sql)) {
                                                    $update_stmt->bind_param('s', $task_id);
                                                    if ($update_stmt->execute()) {
                                                        // Update vehicle cargo
                                                        $vehicle_id = $rescuer['id'];
                                                        $item_id = $task['item_id'];
                                                        $quantity = $task['quantity'];

                                                        if ($task['type'] === 'Request') {
                                                            // Subtract quantity from vehicle cargo
                                                            $cargo_update_sql = "
                                                                UPDATE VehicleCargo
                                                                SET quantity = quantity - ?
                                                                WHERE vehicle_id = ? AND item_id = ?";
                                                        } else if ($task['type'] === 'Offer') {
                                                            // Add quantity to vehicle cargo
                                                            $cargo_update_sql = "
                                                                UPDATE VehicleCargo
                                                                SET quantity = quantity + ?
                                                                WHERE vehicle_id = ? AND item_id = ?";
                                                        }

                                                        if ($cargo_update_stmt = $conn->prepare($cargo_update_sql)) {
                                                            $cargo_update_stmt->bind_param('iss', $quantity, $vehicle_id, $item_id);
                                                            if ($cargo_update_stmt->execute()) {
                                                                $response['status'] = 'success';
                                                            } else {
                                                                $response['status'] = 'error';
                                                                $response['message'] = 'Failed to update vehicle cargo: ' . $cargo_update_stmt->error;
                                                            }
                                                            $cargo_update_stmt->close();
                                                    }  else {
                                                        $response['status'] = 'error';
                                                        $response['message'] = 'Prepare cargo update statement failed: ' . $conn->error;
                                                    } 
                                                }else {
                                                        $response['status'] = 'error';
                                                        $response['message'] = 'Failed to update task status: ' . $update_stmt->error;
                                                    }
                                                    $update_stmt->close();
                                                } else {
                                                    $response['status'] = 'error';
                                                    $response['message'] = 'Prepare update statement failed: ' . $conn->error;
                                                }
                                            } else {
                                                $response['status'] = 'error';
                                                $response['message'] = 'Rescuer is not within 50 meters of the task location.';
                                            }
                                        } else {
                                            $response['status'] = 'error';
                                            $response['message'] = 'Task User not found.';
                                        }
                                    } else {
                                        $response['status'] = 'error';
                                        $response['message'] = 'Execute user query failed: ' . $user_stmt->error;
                                    }
                                    $user_stmt->close();
                                } else {
                                    $response['status'] = 'error';
                                    $response['message'] = 'Prepare user statement failed: ' . $conn->error;
                                }
                            } else {
                                $response['status'] = 'error';
                                $response['message'] = 'Task not found or already completed.';
                            }
                        } else {
                            $response['status'] = 'error';
                            $response['message'] = 'Execute task query failed: ' . $task_stmt->error;
                        }
                        $task_stmt->close();
                    } else {
                        $response['status'] = 'error';
                        $response['message'] = 'Prepare task statement failed: ' . $conn->error;
                    }
                } else {
                    $response['status'] = 'error';
                    $response['message'] = 'Rescuer not found.';
                }
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Execute rescuer query failed: ' . $rescuer_stmt->error;
            }
            $rescuer_stmt->close();
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Prepare rescuer statement failed: ' . $conn->error;
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Invalid task ID.';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'User not authenticated.';
}

echo json_encode($response);

function haversineGreatCircleDistance($lat1, $lon1, $lat2, $lon2, $earthRadius = 6371)
{
    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);

    $a = sin($dLat / 2) * sin($dLat / 2) +
         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
         sin($dLon / 2) * sin($dLon / 2);

    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

    $distance = $earthRadius * $c;

    return $distance;
}
?>
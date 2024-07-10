<?php

header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
session_start();
$conn->set_charset("utf8");

if (isset($_SESSION['user_auth'])){

    $user_id = $_SESSION['user_auth']['id'];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        if (isset($_POST['vehicle_id'])){

            $vehicle_id = $_POST['vehicle_id'];

            $sqlCheckUser = "SELECT COUNT(*) AS count FROM VehicleAssignments WHERE user_id = ?";
            $stmtCheckUser = $conn->prepare($sqlCheckUser);
            $stmtCheckUser->bind_param("s", $user_id);
            $stmtCheckUser->execute();
            $resultCheckUser = $stmtCheckUser->get_result()->fetch_assoc();

            if ($resultCheckUser['count'] > 0) {
                // Ο χρήστης είναι ήδη ανατεθημένος σε ένα όχημα
                http_response_code(409); // Conflict
                $response = array("status" => "already_assigned", "message" => "Ο χρήστης είναι ήδη ανατεθημένος σε ένα όχημα.");
                echo json_encode($response);
                $conn->close();
                exit;
            }

            $sql  = "SELECT assigned_rescuers FROM vehicles WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt -> bind_param("s", $vehicle_id );
            $stmt ->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if ($result && $result['assigned_rescuers'] < 2) {

                // Ενημερώνει τον αριθμό των διασωστών
                $sql = "UPDATE Vehicles SET assigned_rescuers = assigned_rescuers + 1 WHERE id = ?";
                $stmt = $conn->prepare($sql);
                $stmt -> bind_param("s", $vehicle_id );
                $stmt ->execute();

                // Προσθήκη εγγραφής στον πίνακα VehicleAssignments
                $sql = "INSERT INTO VehicleAssignments (vehicle_id, user_id) VALUES (?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt -> bind_param("ss", $vehicle_id, $user_id);
                $stmt ->execute();

                http_response_code(200);
                $response = array("status" => "success", "message" => "Η αναθεσή σας στο διαθέσιμο όχημα ηταν επιτυχής !");

            } else if ($result['assigned_rescuers'] >= 2){
                http_response_code(412);
                $response = array("status" => "criteria_412", "message" => "Δεν είναι δυνατή η ανάθεση. Το όχημα έχει ήδη τον μέγιστο αριθμό διασωστών.");
            } else{
                http_response_code(500);
                $response = array("status" => "server_error" , "message" => "Σφάλμα κατά την ανάθεσή σας στο διαθέσιμο όχημα: " . $conn->error);
            }

        } else {
            http_response_code(400);
            $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
        }

    } else {
        http_response_code(405);
        $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
    }

}else{

    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Δεν υπήρχε σύνδεση χρήστη ή συνδεσή σας έληξε');
}

    echo json_encode($response);
    $conn->close();
?>
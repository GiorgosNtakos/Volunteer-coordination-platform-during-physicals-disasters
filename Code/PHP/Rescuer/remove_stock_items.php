<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: DELETE");
require '../Global/db_connect.php';
$conn->set_charset("utf8");
session_start();
if (isset($_SESSION['user_auth']) && isset($_SESSION['item_id_auth'])){
    
    $user_id = $_SESSION['user_auth']['id'];
    $item_id = $_SESSION['item_id_cargo'];

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $vehicle_id_query = "SELECT vehicle_id FROM VehicleAssignments WHERE user_id = ?";
        $stmt = $conn->prepare($vehicle_id_query);
        $stmt->bind_param('s', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $vehicle_id = $row['vehicle_id'];

            if(isset($_POST['quantity'])){

                $desired_quantity=(int)$_POST['quantity'];

                            // Ελέγξτε τη διαθεσιμότητα του είδους στο όχημα
                $stmt = $conn->prepare("SELECT quantity FROM vehiclecargo WHERE item_id = ? AND vehicle_id =  ?");
                $stmt->bind_param("is", $item_id, $vehicle_id);
                $stmt->execute();
                $result = $stmt->get_result()->fetch_assoc();

                if (!$result || $result['quantity'] < $desired_quantity) {
                    http_response_code(409);
                    $response = array('status' => 'noSuch_quantity', 'message' => 'Η ποσότητα που θέλετε να αφαιρέσετε υπερβαίνει την ποσότητα του οχήματος.');
                    echo json_encode($response);
                    $stmt->close();
                    $conn->close();
                    exit;
                }

                            // Αφαιρέστε την ποσότητα από το όχημα
                    $stmtVehicle = $conn->prepare("UPDATE vehiclecargo SET quantity = quantity - ? WHERE item_id = ? AND vehicle_id = ?");
                    $stmtVehicle->bind_param("iis", $desired_quantity, $item_id, $vehicle_id);
                    $stmtVehicle->execute();

                    if ($stmtVehicle->affected_rows > 0) {
                        $newQuantityCheck = $conn->prepare("SELECT quantity FROM vehiclecargo WHERE item_id = ? AND vehicle_id = ?");
                        $newQuantityCheck->bind_param("is", $item_id, $vehicle_id);
                        $newQuantityCheck->execute();
                        $quantityResult = $newQuantityCheck->get_result()->fetch_assoc();
                        $newQuantityCheck->close();
                    
                        if ($quantityResult['quantity'] == 0) {
                            // Αφού η ποσότητα είναι μηδέν, διαγράψτε την εγγραφή
                            $deleteStmt = $conn->prepare("DELETE FROM vehiclecargo WHERE item_id = ? AND vehicle_id = ?");
                            $deleteStmt->bind_param("is", $item_id, $vehicle_id);
                            $deleteStmt->execute();
                            $deleteStmt->close();
                        }
                    }

                    // Προσθέστε την ποσότητα στην αποθήκη
                    $stmtBase = $conn->prepare("UPDATE warehouse_stock SET quantity = quantity + ? WHERE item_id = ?");
                    $stmtBase->bind_param("ii", $desired_quantity, $item_id);
                    $stmtBase->execute();

                    if ($stmtVehicle->affected_rows > 0 && $stmtBase->affected_rows > 0) {
                        http_response_code(200);
                        $response = array('status' => 'success', 'message' => 'Αφαιρέθηκαν απο το όχημα '.$desired_quantity. ' τεμάχια και προστέθηκαν στην Αποθήκη επιτυχώς!');
                    } else {
                        http_response_code(500);
                        $response = array('status' => 'server_error', 'message' => 'Προέκυψε σφάλμα κατά τη ξεφόρτωση της ποσότητας του αντικειμένου.');
                    }
                    $stmt->close();
                    $stmtVehicle->close();
                    $stmtBase->close();

            } else{
                // Αν λείπουν πεδία
           http_response_code(400);
           $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
           }

        } else {
            http_response_code(404);
            $response = array("status" => "vehicle_not_found", "message" => "Δεν βρέθηκε όχημα για τον διασώστη.");
        }

    } else{
        http_response_code(405);
        $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
    }
} else{
    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Δεν υπήρχε σύνδεση χρήστη ή συνδεσή σας έληξε ή το id του αντικειμέ
    νου δεν ταυτοποιήθηκε.');
}

echo json_encode($response);
$conn->close();

?>
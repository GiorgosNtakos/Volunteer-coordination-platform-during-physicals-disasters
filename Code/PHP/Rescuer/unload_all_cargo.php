<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: DELETE");
require '../Global/db_connect.php';
$conn->set_charset("utf8");
session_start();
if (isset($_SESSION['user_auth'])){

    $user_id = $_SESSION['user_auth']['id'];

    if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
        $vehicle_id_query = "SELECT vehicle_id FROM vehicles_assignments WHERE user_id = ?";
        $stmt = $conn->prepare($vehicle_id_query);
        $stmt->bind_param('s', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $vehicle_id = $row['vehicle_id'];

            $sql = "SELECT item_id, quantity FROM vehiclecargo WHERE vehicle_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $vehicle_id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $item_id = $row['item_id'];
                    $quantity = $row['quantity'];

                    // Ενημέρωση των ποσοτήτων στην αποθήκη
                    $updateSql = "UPDATE warehouse_stock SET quantity = quantity + ? WHERE item_id = ?";
                    $updateStmt = $conn->prepare($updateSql);
                    $updateStmt->bind_param("ii", $quantity, $item_id);
                    $updateStmt->execute();

                    // Αφαίρεση αντικειμένων από το φορτίο του οχήματος
                    $deleteSql = "DELETE FROM vehiclecargo WHERE item_id = ? AND vehicle_id = ?";
                    $deleteStmt = $conn->prepare($deleteSql);
                    $deleteStmt->bind_param("is", $item_id, $vehicle_id);
                    $deleteStmt->execute();
                }
                http_response_code(200);
                $response = array("status" => "success", "message" => "Το φορτίο ξεφορτώθηκε επιτυχώς.");
                $updateStmt->close();
                $deleteStmt->close();
            } else if($result->num_rows === 0){
                http_response_code(200);
                $response = array("status" => "cargo_empty" , "message" => "Το οχημά σας είναι άδειο.");
            } else {
                http_response_code(500);
                $response = array("status" => "server_error" , "message" => "Σφάλμα κατά το ξεφόρτωμα του φορτίου του οχήματος: " . $conn->error);
            }
        }  else {
            http_response_code(404);
            $response = array("status" => "vehicle_not_found", "message" => "Δεν βρέθηκε όχημα για τον διασώστη.");
        }
        $stmt->close(); 
    } else{
        http_response_code(405);
        $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
    }
}  else{
    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Δεν υπήρχε σύνδεση χρήστη ή συνδεσή σας έληξε');
}
echo json_encode($response);
$conn->close();
?>
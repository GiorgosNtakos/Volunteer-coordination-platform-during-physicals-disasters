<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");
session_start();

if (isset($_SESSION['user_auth'])){

    $user_id = $_SESSION['user_auth']['id'];

    if ($_SERVER["REQUEST_METHOD"] === "GET") {

        $vehicle_id_query = "SELECT vehicle_id FROM VehicleAssignments WHERE user_id = ?";
        $stmt = $conn->prepare($vehicle_id_query);
        $stmt->bind_param('s', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $vehicle_id = $row['vehicle_id'];
            if(isset($_GET['itemName'])){

                $itemName = $_GET['itemName'];

                $sql = "SELECT vehiclecargo.id AS vehicle_cargo_id, items.name, vehiclecargo.quantity AS quantity, vehiclecargo.item_id FROM vehiclecargo
                JOIN items ON vehiclecargo.item_id = items.id 
                WHERE items.name = ? AND vehiclecargo.vehicle_id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ss", $itemName, $vehicle_id);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows > 0) {
                    $item_info = $result->fetch_assoc();

                    $_SESSION['item_id_cargo'] = $item_info['item_id'];
                    http_response_code(200);
                    $response = array("status" => "success", "message" =>"Οι πληροφορίες του είδους ανακτήθηκαν επιτιχώς", "item_info" => $item_info);
                } else if($result->num_rows === 0) {
                    http_response_code(200);
                    $response = array("status" => "success_but_empty" , "message" => "Δεν βρέθηκαν δεδομένα για το αντικείμενο στο συγκεκριμένο όχημα." . $conn->error);
                } else{
                    http_response_code(500);
                    $response = array("status" => "server_error" , "message" => "Σφάλμα κατά την ανάκτηση πληροφοριών του είδους: " . $conn->error);
                }

            } else {
                http_response_code(400);
                $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα GET.");
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
    $response = array("status" => "need_connection", "message" => 'Δεν υπήρχε σύνδεση χρήστη ή συνδεσή σας έληξε');
}

// Κλείσιμο της σύνδεσης με τη βάση δεδομένων
echo json_encode($response);
$stmt->close();
$conn->close();
?>
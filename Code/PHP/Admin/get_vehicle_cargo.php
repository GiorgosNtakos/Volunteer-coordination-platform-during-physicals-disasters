<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if(isset($_GET['vehicleId'])){

        $vehicleId = $_GET['vehicleId'];

        $sql = "SELECT vehiclecargo.quantity, items.name FROM vehiclecargo
        LEFT JOIN items ON vehiclecargo.item_id = items.id
        WHERE vehiclecargo.vehicle_id = ?";

        $stmt = $conn -> prepare($sql);
        $stmt->bind_param("s", $vehicleId);
        $stmt -> execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $items = array();
        
            while ($row = $result->fetch_assoc()) {
                $items[] = $row;
            }
        
            http_response_code(200);
            $response = array(
                "status" => "success",
                "message" => "Επιτυχής ανάκτηση αντικειμένων του οχήματος",
                "items" => $items
            );

        } else if($result->num_rows === 0) {
            http_response_code(200);
            $response = array("status" => "success_but_empty" , "message" => "Δεν υπάρχουν αντικείμενα αποθηκευμένα." . $conn->error);
        } else{
            http_response_code(500);
            $response = array("status" => "server_error" , "message" => "Σφάλμα κατά την ανάκτηση των αντικειμένων: " . $conn->error);
        }

    } else {
        // Αν λείπουν πεδία
        http_response_code(400);
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα GET.");
    }
} else{
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

// Κλείσιμο της σύνδεσης με τη βάση δεδομένων
echo json_encode($response);
$stmt->close();
$conn->close();
?>
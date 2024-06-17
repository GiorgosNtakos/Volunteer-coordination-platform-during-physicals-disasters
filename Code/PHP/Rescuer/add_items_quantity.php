<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: DELETE");
require '../Global/db_connect.php';
require 'C:\wamp64\www\webproject\Code\PHP\vendor\autoload.php';
$conn->set_charset("utf8");
use Ramsey\Uuid\Uuid;
session_start();
if (isset($_SESSION['user_auth']) && isset($_SESSION['item_id_auth'])){
    
    $user_id = $_SESSION['user_auth']['id'];
    $item_id = $_SESSION['item_id_auth'];
    

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

                $stmt = $conn->prepare("SELECT quantity FROM warehouse_stock WHERE item_id = ?");
                $stmt->bind_param("s", $item_id);
                $stmt->execute();
                $result = $stmt->get_result()->fetch_assoc();
            
                // Αν δεν υπάρχει το είδος ή η ποσότητα είναι ανεπαρκής
                if (!$result || $result['quantity'] < $desired_quantity) {
                    http_response_code(409);
                    $response = array('status' => 'noSuch_quantity', 'message' => 'Η ποσότητα που επιθυμείτε υπερβαίνει τη διαθεσιμότητα.');
                    echo json_encode($response);
                    $stmt->close();
                    $conn->close();
                    exit;
                }

                $updateWarehouse = $conn->prepare("UPDATE warehouse_stock SET quantity = quantity - ? WHERE item_id = ?");
                $updateWarehouse->bind_param("is", $desired_quantity, $item_id);
                $updateWarehouse->execute();

                $uuid = Uuid::uuid4();
                $cargo_id = mysqli_real_escape_string($conn,$uuid->toString());

                // Προσθήκη ποσότητας στο φορτίο του οχήματος
                // Υποθέτουμε ότι υπάρχει ήδη ένας πίνακας vehicle_cargo για το φορτίο κάθε οχήματος
                $updateVehicle = $conn->prepare("INSERT INTO vehiclecargo (id, vehicle_id, item_id, quantity) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?");
                $updateVehicle->bind_param("ssiii", $cargo_id, $vehicle_id, $item_id, $desired_quantity, $desired_quantity);
                $updateVehicle->execute();

                if ($updateWarehouse->affected_rows > 0 && $updateVehicle->affected_rows > 0) {
                    http_response_code(200);
                    $response = array('status' => 'success', 'message' => 'Το αντικείμενο φορτώθηκε με επιτυχία στο όχημα.');
                } else {
                    http_response_code(500);
                    $response = array('status' => 'server_error', 'message' => 'Προέκυψε σφάλμα κατά τη φόρτωση του αντικειμένου.');
                }
                $stmt->close();
                $updateVehicle->close();
                $updateWarehouse->close();

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
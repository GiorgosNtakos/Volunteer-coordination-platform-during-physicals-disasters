<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: DELETE");
require '../Global/db_connect.php';
$conn->set_charset("utf8");

parse_str(file_get_contents("php://input"), $_DELETE);

if ($_SERVER["REQUEST_METHOD"] === 'DELETE') {
    if (isset($_DELETE['itemName'])) {
        
        $itemName = $_DELETE["itemName"];

        $sql = "SELECT id FROM items WHERE name = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $itemName);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Διαγραφή του προϊόντος
            $sql = "DELETE items,warehouse_stock FROM items INNER JOIN warehouse_stock ON warehouse_stock.item_id = items.id WHERE name = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $itemName);
            if ($stmt->execute()) {                
                // Επιτυχής διαγραφή και ενημέρωση
                http_response_code(200);
                $response = array("status" => "success", "message" => "Το είδος διαγράφηκε επιτυχώς.");
    
            } else {
                // Σφάλμα κατά τη διαγραφή του προϊόντος
                http_response_code(500); // Επιστροφή κωδικού σφάλματος 500
                $response = array("status" => "server_error", "message" => "Σφάλμα κατά τη διαγραφή του είδους: " . $conn->error);
            }
        } else {
            // Το προϊόν δεν βρέθηκε
            http_response_code(404);
            $response = array("status" => "not_found_404", "message" => "Το είδος δεν βρέθηκε.");
        }

    } else {
        // Μη έγκυρο όνομα προϊόντος
        http_response_code(400); // Επιστροφή κωδικού σφάλματος 400
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα DELETE.");
    }
} else {
    // Μη έγκυρη αίτηση
    http_response_code(405); // Επιστροφή κωδικού σφάλματος 400
   $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

echo json_encode($response);
$conn->close();
?>
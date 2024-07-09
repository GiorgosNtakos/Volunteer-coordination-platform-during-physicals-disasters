<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: DELETE");
require '../Global/db_connect.php';
$conn->set_charset("utf8");

parse_str(file_get_contents("php://input"), $_DELETE);

if ($_SERVER["REQUEST_METHOD"] === 'DELETE') {
    if (isset($_DELETE['item_id'])) {
        
        $item_id = $_DELETE["item_id"];

            $sql = "DELETE FROM warehouse_stock WHERE item_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $item_id);
            if ($stmt->execute()) {
                // Επιτυχής διαγραφή και ενημέρωση
                http_response_code(200);
                $response = array("status" => "success", "message" => "H ποσοτητα διαγράφηκε επιτυχώς.");

            } else {
                // Σφάλμα κατά τη διαγραφή του προϊόντος
                http_response_code(500); // Επιστροφή κωδικού σφάλματος 500
                $response = array("status" => "server_error", "message" => "Σφάλμα κατά τη διαγραφή της ποσοτητας: " . $conn->error);
            }

            // Διαγραφή του προϊόντος
            $sql = "DELETE FROM items WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $item_id);
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
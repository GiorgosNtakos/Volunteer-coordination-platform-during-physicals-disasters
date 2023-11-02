<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
//header("Access-Control-Allow-Methods: DELETE");
require 'db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === 'POST') {
    $productName = isset($_POST["productName"]) && $_POST["productName"] !== null ? mysqli_real_escape_string($conn, $_POST["productName"]) : null;
    $productName = stripslashes($productName);
    if ($productName !== null) {

        // Εύρεση του id του προϊόντος που θα διαγραφεί
        $sql_select = "SELECT product_id FROM products WHERE name = ?";
        $stmt = $conn->prepare($sql_select);
        $stmt->bind_param("s", $productName);
        $stmt->execute();
        $result_select = $stmt->get_result();

        if ($result_select->num_rows > 0) {
            $row = $result_select->fetch_assoc();
            $productIdToDelete = $row["product_id"];
            
            // Διαγραφή του προϊόντος
            $sql_delete = "DELETE FROM products WHERE name = ?";
            $stmt = $conn->prepare($sql_delete);
            $stmt->bind_param("s", $productName);
            if ($stmt->execute()) {
                // Μείωση των id των προϊόντων με μεγαλύτερο id κατά 1
                $sql_update = "UPDATE products SET product_id = product_id - 1 WHERE product_id > ?";
                $stmt = $conn->prepare($sql_update);
                $stmt->bind_param("i", $productIdToDelete);
                if($stmt->execute())
                {
                    http_response_code(204);
                    $response = array("status" => "no_return_id", "message" => "Επιτυχής ενημέρωση id.");
                } else {
                    http_response_code(500);
                    $response = array("status" => "server_error", "message" => "Σφάλμα κατά την ενημέρωση του id.");
                }
                
                // Επιτυχής διαγραφή και ενημέρωση
                http_response_code(200);
                $response = array("status" => "success", "message" => "Το προϊόν διαγράφηκε επιτυχώς.");
    
            } else {
                // Σφάλμα κατά τη διαγραφή του προϊόντος
                http_response_code(500); // Επιστροφή κωδικού σφάλματος 500
                $response = array("status" => "server_error", "message" => "Σφάλμα κατά τη διαγραφή του προϊόντος: " . $conn->error);
            }
        } else {
            // Το προϊόν δεν βρέθηκε
            http_response_code(404);
            $response = array("status" => "not_found_404", "message" => "Το προϊόν δεν βρέθηκε.");
        }
    } else {
        // Μη έγκυρο όνομα προϊόντος
        http_response_code(400); // Επιστροφή κωδικού σφάλματος 400
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
    }
} else {
    // Μη έγκυρη αίτηση
    http_response_code(405); // Επιστροφή κωδικού σφάλματος 400
   $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

echo json_encode($response);
$conn->close();
?>

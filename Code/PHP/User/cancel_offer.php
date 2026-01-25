<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: DELETE");
require '../Global/db_connect.php';
$conn->set_charset("utf8");
session_start();

parse_str(file_get_contents("php://input"), $_DELETE);

if (isset($_SESSION['user_auth'])){

    $user_id = $_SESSION['user_auth']['id'];

    if ($_SERVER["REQUEST_METHOD"] === 'DELETE') {

        if(isset($_DELETE['offer_id'])){

            $offer_id = $_DELETE['offer_id'];
            $type = "Offer";

            $sql = "SELECT item_id, quantity, announcement_id FROM tasks WHERE id = ? AND user_id = ? AND type = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sss", $offer_id, $user_id, $type);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $item_id = $row['item_id'];
                $quantity = $row['quantity'];
                $announcement_id = $row['announcement_id'];

                $sql = "DELETE FROM Tasks WHERE id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("s", $offer_id);

                if ($stmt->execute()) {
                    // Επαναφορά της ποσότητας στην ανακοίνωση
                    $sql = "UPDATE announcementitems SET covered_quantity = covered_quantity - ? WHERE announcement_id = ? AND item_id = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("isi", $quantity, $announcement_id, $item_id);
                    $stmt->execute();
                    
                    http_response_code(200);
                    $response=array("status" => "success", "message" => "Η προσφορά ακυρώθηκε επιτυχώς.");
                } else {
                    http_response_code(200);
                    $response=array("status" => "server_error", "message" => "Σφάλμα κατά την ακύρωση της προσφοράς: " . $stmt->error);
                }
            } else {
                http_response_code(404);
                $response=array("status" => "not_found_404", "message" => "Η προσφορά δεν βρέθηκε.");
            }

        } else {
            // Μη έγκυρη ανακοίνωση
            http_response_code(400); // Επιστροφή κωδικού σφάλματος 400
            $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα DELETE.");
        }
    } else{
        http_response_code(405);
        $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
    }
} else{
    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Δεν υπήρχε σύνδεση χρήστη ή συνδεσή σας έληξε.');
}

echo json_encode($response);
$stmt->close();
$conn->close();
?>
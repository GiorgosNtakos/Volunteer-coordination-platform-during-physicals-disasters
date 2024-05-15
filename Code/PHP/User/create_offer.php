<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
require 'C:\wamp64\www\webproject\Code\PHP\vendor\autoload.php';
$conn->set_charset("utf8");
use Ramsey\Uuid\Uuid;
session_start();

if (isset($_SESSION['user_auth'])) {

    $user_id = $_SESSION['user_auth']['id'];

    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        if(isset($_POST['item_id']) && isset($_POST['quantity']) && isset($_POST['announcement_id'])){

            $item_id = $_POST['item_id'];
            $quantity = $_POST['quantity'];
            $announcement_id = $_POST['announcement_id'];

            $uuid = Uuid::uuid4();
            $task_id = mysqli_real_escape_string($conn,$uuid->toString());
            $type = "Offer";

            $sql = "SELECT quantity, covered_quantity FROM announcementitems WHERE announcement_id = ? AND item_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("si", $announcement_id, $item_id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $required_quantity = $row['quantity'] - $row['covered_quantity'];
            
                // Αν η προσφερόμενη ποσότητα υπερβαίνει την απαιτούμενη ποσότητα, προσαρμόζουμε την ποσότητα
                if ($quantity > $required_quantity) {
                    $quantity = $required_quantity;
                }

                $sql = "INSERT INTO tasks (id, quantity, type, item_id, user_id, announcement_id) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("sisissi", $task_id, $quantity, $type, $item_id, $user_id, $announcement_id, $quantity);

                if ($stmt->execute()) {
                    $sql = "UPDATE AnnouncementItems SET covered_quantity = covered_quantity + ? WHERE announcement_id = ? AND item_id = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("isi", $quantity, $announcement_id, $item_id);
                    $stmt->execute();
                    http_response_code(200);
                    $response = array('status' => 'success', 'message' => 'Η προσφορά σας δημιουργήθηκε με επιτυχία.');
                } else {
                    http_response_code(500);
                    $response = array('status' => 'server_error', 'message' => 'Προέκυψε σφάλμα κατά τη δημιουργία της προσφοράς.');
                }
                //$stmt->close();
            }
        } else{
            // Αν λείπουν πεδία
        http_response_code(400);
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
       }

    } else{
        http_response_code(405);
        $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
    }
} else{
    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Δεν υπάρχει σύνδεση χρήστη ή συνδεσή σας έληξε.');
}

echo json_encode($response);
$conn->close();
?>
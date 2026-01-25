<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
require 'C:\wamp64\www\webproject\Code\PHP\vendor\autoload.php'; 

$conn->set_charset("utf8");
use Ramsey\Uuid\Uuid;
session_start();

if (isset($_SESSION['user_auth'])){

    $user_id = $_SESSION['user_auth']['id'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (isset($_POST['item_name']) && isset($_POST['content']) && isset($_POST['items'])) {

        $item_id = $_POST['item_name'];
        $quantity = $_POST['content'];
        $items = json_decode($_POST['items'], true);
        $uuid1 = Uuid::uuid4();
        $announcement_id = mysqli_real_escape_string($conn,$uuid1->toString());

            // Εισαγωγή στον πίνακα Announcements
            $stmt = $conn->prepare("INSERT INTO announcements (id, user_id) VALUES (?, ?)");
            $stmt->bind_param("ss", $announcement_id, $user_id);
            if (!$stmt->execute()) {
                error_log("Error inserting into announcements: " . $stmt->error);
                $stmt->close();
                http_response_code(500);
                echo json_encode(array("status" => "server_error", "message" => "Σφαλμα κατα την δημιουργία της ανακοίνωσης."));
                exit;
            }

            
            $stmt = $conn->prepare("INSERT INTO AnnouncementItems (announcement_id, item_id, quantity) VALUES (?, ?, ?)");
                    $stmt->bind_param("sii", $announcement_id,  $item_id, $quantity);
                    if (!$stmt->execute()) {
                        error_log("Error inserting item in AnnouncementItems: " . $stmt->error);
                        $stmt->close();
                        http_response_code(500);
                        echo json_encode(array("status" => "server_error", "message" => "Σφαλμα κατα την δημιουργία της ανακοίνωσης."));
                        exit;
                    }
                    $stmt->close();

            // Εισαγωγή στον πίνακα AnnouncementItems για κάθε είδος
            foreach ($items as $item) {

                $checkStmt = $conn->prepare("SELECT quantity FROM AnnouncementItems WHERE announcement_id = ? AND item_id = ?");
                $checkStmt->bind_param("si", $announcement_id, $item['item_name']);
                $checkStmt->execute();
                $checkStmt->store_result();
        
                if ($checkStmt->num_rows > 0) {
                    // Αν υπάρχει ήδη, κάνουμε update την ποσότητα
                    $checkStmt->bind_result($existingQuantity);
                    $checkStmt->fetch();
                    $newQuantity = $existingQuantity + $item['content'];
                    $updateStmt = $conn->prepare("UPDATE AnnouncementItems SET quantity = ? WHERE announcement_id = ? AND item_id = ?");
                    $updateStmt->bind_param("isi", $newQuantity, $announcement_id, $item['item_name']);
                    $updateStmt->execute();
                    $updateStmt->close();
                    
                    $updateAnnouncementStmt = $conn->prepare("UPDATE Announcements SET updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                    $updateAnnouncementStmt->bind_param("s", $announcement_id);
                    $updateAnnouncementStmt->execute();
                    $updateAnnouncementStmt->close();
        
                } else {

                    $stmt = $conn->prepare("INSERT INTO AnnouncementItems (announcement_id, item_id, quantity) VALUES (?, ?, ?)");
                    $stmt->bind_param("sii", $announcement_id,  $item['item_name'], $item['content']);
                    if (!$stmt->execute()) {
                        error_log("Error inserting item in AnnouncementItems: " . $stmt->error);
                        $stmt->close();
                        http_response_code(500);
                        echo json_encode(array("status" => "error", "message" => "Σφαλμα κατα την δημιουργία της ανακοίνωσης."));
                        exit;
                    }
                    $stmt->close();
                }
            }
        http_response_code(201);
        $response = array("status" => "success", "message" => "Η ανακοίνωση δημιουργήθηκε με επιτυχία.");


        } else {
            $response = array("status" => "missing", "message" => "Λείπουν απαραίτητα δεδομένα από το αίτημα POST.");
            http_response_code(400);
        }
    } else {
        $response = array("status" => "wrong_method", "message" => "Μη έγκυρη μέθοδος αίτησης.");
        http_response_code(405);
    }
} else{
    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Δεν υπήρχε σύνδεση χρήστη ή συνδεσή σας έληξε.');
}


echo json_encode($response);
$conn->close();
?>
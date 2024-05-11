<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php'; 

$conn->set_charset("utf8");
use Ramsey\Uuid\Uuid;
session_start();

if (isset($_SESSION['user_auth'])){

    $user_id = $_SESSION['user_auth']['id'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode($_POST['select_item'], true);

    if (!empty($data['select_item'])) {
        $items = $data['select_item'];

        $uuid = Uuid::uuid4();
        $announcement_id = mysqli_real_escape_string($conn,$uuid->toString());


            // Εισαγωγή στον πίνακα Announcements
            $stmt = $conn->prepare("INSERT INTO announcements (id, user_id) VALUES (?, ?)");
            $stmt->bind_param("ss", $announcement_id, $user_id);
            $stmt->execute();

            // Εισαγωγή στον πίνακα AnnouncementItems για κάθε είδος
            $stmt = $conn->prepare("INSERT INTO AnnouncementItems (announcement_id, item_id, quantity) VALUES (?, ?, ?)");
            foreach ($items as $item) {
                $stmt->bind_param("sii", $announcement_id, $item['item_id'], $item['quantity']);

                $stmt->execute(); 
                if ($stmt->affected_rows > 0) {
                    http_response_code(201);
                    $response = array('status' => 'success', 'message' => 'Η ανακοινωσή σας δημιουργήθηκε με επιτυχία.');
                } else {
                    http_response_code(500);
                    $response = array('status' => 'server_error', 'message' => 'Προέκυψε σφάλμα κατά τη δημιουργία της ανακοίνωσης.');
                }
        } 
        $stmt->close();
        } else {
            $response = array("status" => "missing_data", "message" => "Missing required data.");
            http_response_code(400);
        }
    } else {
        $response = array("status" => "invalid_request", "message" => "Invalid request method.");
        http_response_code(405);
    }
} else{
    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Δεν υπήρχε σύνδεση χρήστη ή συνδεσή σας έληξε.');
}

echo json_encode($response);
$conn->close();
?>
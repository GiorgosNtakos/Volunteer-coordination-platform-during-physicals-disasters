<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");
session_start();

if (isset($_SESSION['user_auth'])){

    $user_id = $_SESSION['user_auth']['id'];

    if ($_SERVER["REQUEST_METHOD"] === "GET") {

        $type = "Offer";

        $sql = "SELECT tasks.id, tasks.quantity, tasks.status, tasks.created_at, tasks.updated_at, tasks.user_id, items.name AS name FROM tasks
        LEFT JOIN items ON tasks.item_id = items.id
        WHERE user_id = ? AND type = ? ORDER BY created_at DESC";
        $stmt = $conn -> prepare($sql);
        $stmt -> bind_param("ss", $user_id, $type);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $offers = array();
        
            while ($row = $result->fetch_assoc()) {
                $offers[] = $row;
            }
        
            http_response_code(200);
            $response = array(
                "status" => "success",
                "message" => "Επιτυχής ανάκτηση των αιτήσεων",
                "offers" => $offers
            );

        } else if($result->num_rows === 0) {
            http_response_code(200);
            $response = array("status" => "success_but_empty" , "message" => "Δεν υπάρχουν προσφορές." . $conn->error);
        } else{
            http_response_code(500);
            $response = array("status" => "server_error" , "message" => "Σφάλμα κατά την ανάκτηση των προσφορών: " . $conn->error);
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
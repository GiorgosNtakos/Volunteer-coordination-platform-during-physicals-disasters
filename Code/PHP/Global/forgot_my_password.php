<?php 
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    if (isset($_POST['email']) && $_POST['newPassword']) {

        $email = $_POST['email'];
        $newPassword = $_POST['newPassword'];

        $sql = "SELECT id FROM Users WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result(); 

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($user_id);
            $stmt->fetch();
    
            // Ενημερώνουμε τον κωδικό του χρήστη
            $new_hashed_password = password_hash($newPassword, PASSWORD_DEFAULT);
            $update_sql = "UPDATE Users SET password = ? WHERE email = ?";
            $update_stmt = $conn->prepare($update_sql);
            $update_stmt->bind_param('ss', $new_hashed_password, $email);

            if ($update_stmt->execute()) {
                http_response_code(200);
                $response = array("status" => "success", "message" => "Ο κωδικός ενημερώθηκε με επιτυχία.");
            } else {
                http_response_code(500);
                $response = array("status" => "server_error", "message" => "Σφάλμα κατά την ενημέρωση του κωδικού: " . $update_stmt->error);
            }
            $update_stmt->close();
        } else {
            http_response_code(404);
            $response = array("status" => "not_found", "message" => "Το email που δώσατε είναι λάθος.");
        }
        $stmt->close();

    } else{
        http_response_code(400);
        $response = array("status" => "missing_400","message" => "Λείπουν παράμετροι από το αίτημα POST.");
    }

} else{
    http_response_code(405);
    $response = array("status" => "wrong_method_405" , "message" => "Μη έγκυρη αίτηση.");
}

echo json_encode($response);
$conn->close();
?>
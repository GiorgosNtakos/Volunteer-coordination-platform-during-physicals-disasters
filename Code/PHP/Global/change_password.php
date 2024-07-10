<?php 
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");
session_start();

if (isset($_SESSION['user_auth'])){

    $user_id = $_SESSION['user_auth']['id'];

    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        if (isset($_POST['oldPassword']) && $_POST['newPassword']) {

            $oldPassword = $_POST['oldPassword'];
            $newPassword = $_POST['newPassword'];

            $sql = "SELECT password FROM users WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('s', $user_id);
            $stmt->execute();
            $stmt->store_result();
            $stmt->bind_result($hashed_password);
            $stmt->fetch();

            if (password_verify($oldPassword, $hashed_password)) {
                $new_hashed_password = password_hash($newPassword, PASSWORD_DEFAULT);
                $update_sql = "UPDATE users SET password = ? WHERE id = ?";
                $update_stmt = $conn->prepare($update_sql);
                $update_stmt->bind_param('ss', $new_hashed_password, $user_id);
            
                if ($update_stmt->execute()) {
                    http_response_code(200);
                    $response = array("status" => "success", "message" => "Ο κωδικός ενημερώθηκε με επιτυχία.");
                } else {
                    http_response_code(500); 
                    $response = array("status" => "server_error", "message" => "Σφάλμα κατά την ενημέρωση του κωδικού: " . $update_stmt->error);
                }
                $update_stmt->close();
            } else {
                http_response_code(403);
                $response = array("status" => "wrong_old_password", "message" => "Ο παλιός κωδικός είναι λάθος.");
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

} else {
    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Πρέπει να συνδεθείτε');
 }

echo json_encode($response);
$conn->close();
?>
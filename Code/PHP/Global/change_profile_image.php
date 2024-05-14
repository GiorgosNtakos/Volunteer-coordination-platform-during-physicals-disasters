<?php 
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");
session_start();

if (isset($_SESSION['user_auth'])){

    $user_id = $_SESSION['user_auth']['id'];
    $user_type = $_SESSION['user_auth']['type'];

    $upload_dir = '';

    switch ($user_type) {
        case 'Admin':
            $upload_dir = '../../../upload_img/Admin/';
            break;
        case 'Rescuer':
            $upload_dir = '../../../upload_img/rescuer/';
            break;
        case 'Citizen':
            $upload_dir = '../../../upload_img/User';
            break;
        default:
            die("Invalid user type.");
    }

    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {

            $file_tmp = $_FILES['file']['tmp_name'];
            $file_name = $_FILES['file']['name'];
            $file_ext = pathinfo($file_name, PATHINFO_EXTENSION);
            $file_new_name = $user_id . '.' . $file_ext;

            $file_dest = $upload_dir . $file_new_name;

            if (move_uploaded_file($file_tmp, $file_dest)) {
                // Ενημέρωση της img_path στον πίνακα Users
                $img_path_db = '../../../upload_img/' . strtolower($user_type) . '/' . $file_new_name;
        
                $sql = "UPDATE Users SET img_path = ? WHERE id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('ss', $img_path_db, $user_id);
        
                if ($stmt->execute()) {
                    http_response_code(200);
                    $response = array("status" => "success", "message" => "Η εικόνα ενημερώθηκε με επιτυχία.");
                } else {
                    http_response_code(500);
                    $response = array("status" => "server_error", "message" => "Σφάλμα κατά την ενημέρωση της εικόνας: " . $stmt->error);
                }
            } else {
                http_response_code(500);
                $response = array("status" => "server_error", "message" => "Σφάλμα κατά τη μετακίνηση του αρχείου.");
            }

        } else{
            http_response_code(400);
            $response = array("status" => "missing_400","message" => "Σφάλμα κατά το ανέβασμα του αρχείου ή λείπει από το αίτημα POST.");
        }

    } else {
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
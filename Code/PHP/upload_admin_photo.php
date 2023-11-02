<?php 
session_start();
header('Access-Control-Allow-Origin: http://127.0.0.1:5500'); 
header('Content-Type: application/json');
require 'db_connect.php';
$conn->set_charset("utf8");



 if (isset($_SESSION['admin_name'])){
    
 

 $admin_name = $_SESSION['admin_name'];

    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        if(isset($_FILES["image"]) && $_FILES["image"]["error"] == 0)
        {
        $imageFile =  $_FILES["image"];

            $upload_dir = "../../upload_img/Admin/";
            $uniqueFileName = uniqid() . "-" . basename($imageFile["name"]);
            $targetFilePath = mysqli_real_escape_string($conn, $upload_dir . $uniqueFileName);

            if (move_uploaded_file($imageFile["tmp_name"], $targetFilePath)) {
                $sql = "UPDATE admins SET img_path = ? WHERE admin_name = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ss", $targetFilePath, $admin_name);

                if ($stmt->execute()) {
                    http_response_code(200);
                    $response = array('status' => 'success', 'message' => 'Η φωτογραφία ανέβηκε και αποθηκεύτηκε επιτυχώς');
            
                } else {
                    http_response_code(500);
                    $response = array('status' => 'server_error', 'message' => 'Σφάλμα κατά την αποθήκευση στην βάση.Παρακαλώ δοκιμάστε ξανά');
                }
            } else{
                http_response_code(500);
                $response = array('status' => 'server_error', 'message' => 'Υπήρξε κάποιο πρόβλημα κατά τη μετακίνηση του αρχείου.Παρακαλώ δοκιμάστε ξανά') ;
            }
        } else{
            http_response_code(400);
            $response = array("status" => "missing_400","message" => "Σφάλμα κατά το ανέβασμα του αρχείου ή λείπει από το αίτημα POST.");
        }
    } else{
        http_response_code(405); // Επιστροφή κωδικού σφάλματος 400
        $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.". $conn->error);
    }  
} else{
    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Πρέπει να συνδεθείτε');
}

echo json_encode($response);
$conn->close();
?>
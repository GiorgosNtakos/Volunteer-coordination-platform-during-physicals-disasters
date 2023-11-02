<?php 
session_start();
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require 'db_connect.php';
$conn->set_charset("utf8");

 if (isset($_SESSION['admin_name'])){

    $admin_name = $_SESSION['admin_name'];
  
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $oldPassword = isset($_POST["oldPassword"]) && $_POST["oldPassword"] !== '' ? mysqli_real_escape_string($conn, $_POST["oldPassword"]) : null;
        $newPassword = isset($_POST["newPassword"]) && $_POST["newPassword"] !== '' ? mysqli_real_escape_string($conn, $_POST["newPassword"]) : null;

        if($oldPassword && $newPassword)
        {
            $sql = "SELECT password FROM admins WHERE admin_name = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $admin_name);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                if (password_verify($oldPassword, $row["password"])) {
                    $response = array("status" => "success_old_password", "message" => "Σωστός Παλιός κωδικός!");
                    $hashedPassword = password_hash($newPassword,PASSWORD_DEFAULT);
                    $sql = "UPDATE admins set password = ? WHERE admin_name = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("ss", $hashedPassword, $admin_name);
                    

                    if ($stmt->execute()) {
                        http_response_code(200);
                        $response = array("status" => "success_change", "message" => "Ο κωδικός άλλαξε επιτυχώς !");
                
                    } else{
                        http_response_code(500); // Επιστροφή κωδικού σφάλματος 500
                        $response = array("status" => "server_error", "message" => "Σφάλμα κατά την αλλαγη του κωδικού.Δοκιμάστε ξανά.");
                    }
                } else{
                    http_response_code(403); // Επιστροφή κωδικού σφάλματος 403
                    $response = array("status" => "wrong_old_password", "message" => "Ο παλιός κωδικός που δώσατε είναι λάθος.");
                }
            } else{
                http_response_code(404); // Επιστροφή κωδικού σφάλματος 404
                $response = array("status" => "not_found_404", "message" => "Δεν βρέθηκε Διαχειριστής με αυτό το όνομα: ".$admin_name);   
            }
        } else{
            http_response_code(400); // Επιστροφή κωδικού σφάλματος 404
            $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
        }
    } else{
        http_response_code(405); // Επιστροφή κωδικού σφάλματος 405
        $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.". $conn->error);
    }
} else{
    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Πρέπει να συνδεθείτε');
}

echo json_encode($response);
$conn->close();
?>
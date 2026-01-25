<?php 
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");
session_start();



 if (isset($_SESSION['user_auth'])){

    $user_id = $_SESSION['user_auth']['id'];
  
    if ($_SERVER["REQUEST_METHOD"] === "GET") {

        $sql = "SELECT username, email, img_path FROM users WHERE id = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $userName = $row["username"];
            $userEmail = $row["email"];
            $userPhoto = $row["img_path"];

            http_response_code(200);
            $response = array("status" => "success", "message" => "Τα στοιχεια του χρήστη ανακτήθηκαν επιτυχώς απο τη βάση δεδομένων." , "username" => $userName , "email" => $userEmail, "img_path" => $userPhoto );

        } else if($result->num_rows === 0){
            http_response_code(404); // Επιστροφή κωδικού σφάλματος 500
            $response = array("status" => "not_found_404", "message" => "Δεν βρέθηκε o Χρήστης με αυτό το όνομα:".$userName. "ERROR:" . $conn->error);

        } else{
            http_response_code(500);
            $response = array("status" => "server_error", "message" => "Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.");
        }

        $stmt->close();

    } else{
        http_response_code(405);
        $response = array("status" => "wrong_method_405" , "message" => "Μη έγκυρη αίτηση.");
    }
 }else {
    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Πρέπει να συνδεθείτε');
 }

echo json_encode($response);
$conn->close();
?>
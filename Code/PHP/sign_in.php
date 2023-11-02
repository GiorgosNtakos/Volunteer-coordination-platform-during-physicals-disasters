<?php
session_start();
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require 'db_connect.php';


if ($_SERVER["REQUEST_METHOD"] == "GET") {

    $username = isset($_GET["username"]) ? mysqli_real_escape_string($conn, $_GET["username"]) : null;
    $password = isset($_GET["password"]) ? mysqli_real_escape_string($conn, $_GET["password"]) : null;

    if($username !== null && $password !== null){

    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row["password"])) {

            http_response_code(200);
            $response = array("status" => "success", "message" => "Επιτυχής Σύνδεση!");
            $_SESSION['username'] = $username;
            
        } else {
            http_response_code(401);
            $response = array("status" => "password_401", "message" => "Λάθος κωδικός πρόσβασης. Παρακαλώ δοκιμάστε ξανά.");
        }
    } else if($result->num_rows === 0){
            http_response_code(401);
            $response = array("status" => "username_401", "message" => "Λάθος username χρήστη. Παρακαλώ δοκιμάστε ξανά.");
     } else{
            http_response_code(404); // Επιστροφή κωδικού σφάλματος 404
            $response = array("status" => "not_found_404", "message" => "Ο χρηστης που ζητήθηκε δεν βρέθηκε: " . $conn->error);
     }
    } else{

        http_response_code(400); // Επιστροφή κωδικού σφάλματος 400
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα GET.");

    }
} else{

    http_response_code(405); // Επιστροφή κωδικού σφάλματος 400
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.". $conn->error);

}

echo json_encode($response);
$conn->close();
?>

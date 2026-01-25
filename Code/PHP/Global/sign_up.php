<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
require '../vendor/autoload.php';

use Ramsey\Uuid\Uuid;




if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $username = isset($_POST["username"]) && $_POST["username"] !=='' ? mysqli_real_escape_string($conn, $_POST["username"]) : null;
    $email = isset($_POST["email"]) && $_POST["email"] !=='' ? mysqli_real_escape_string($conn, $_POST["email"]) : null;
    $password = isset($_POST["password"]) && $_POST["password"] !=='' ? mysqli_real_escape_string($conn, $_POST["password"]) : null;

    if($username && $email && $password){

    

    // Ελέγχουμε το email ή το username αν υπάρχει ήδη στη βάση
    $checkUsernameQuery = "SELECT * FROM users WHERE username= ?";
    $stmt_check_name = $conn->prepare($checkUsernameQuery);
    $stmt_check_name->bind_param("s", $username );
    $stmt_check_name->execute();
    $result_username = $stmt_check_name->get_result();

    $checkEmailQuery = "SELECT * FROM users WHERE email= ?";
    $stmt_check_email = $conn->prepare($checkEmailQuery);
    $stmt_check_email->bind_param("s", $email );
    $stmt_check_email->execute();
    $result_email = $stmt_check_email->get_result();

        if($result_email->num_rows > 0){
            http_response_code(409);
            $response = array ("status" => "exists_email", "message" => "Το email υπάρχει ήδη! Δοκιμάστε κάποιο άλλο");
        }

        elseif($result_username->num_rows > 0){
            http_response_code(409);
            $response = array ("status" => "exists_name", "message" => "Το username υπάρχει ήδη! Δοκιμάστε κάποιο άλλο");
        }

        else{

            $uuid = Uuid::uuid4();
            $user_id = mysqli_real_escape_string($conn,$uuid->toString());
        
            $hashedPassword = mysqli_real_escape_string($conn,password_hash($password, PASSWORD_DEFAULT));
            $type = "Citizen";

            $sql = "INSERT INTO users (id, username, email, password, type) VALUES (?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssss", $user_id, $username, $email, $hashedPassword, $type);

            if ($stmt->execute()) {
            // Η εγγραφή ήταν επιτυχής
            http_response_code(201);
            $response = array("status" => "created", "message" => "Επιτυχής εγγραφή!");

            } else {
                // Η εγγραφή απέτυχε
                http_response_code(500);
                $response = array("status" => "server_error", "message" => "Η εγγραφή απέτυχε. Παρακαλώ δοκιμάστε ξανά.". $conn->error);
                }
        }
    } else {
        http_response_code(400); // Επιστροφή κωδικού σφάλματος 400
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
    }
} else {
    http_response_code(405); // Επιστροφή κωδικού σφάλματος 400
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.". $conn->error);
}

echo json_encode($response);
$conn->close();
?>
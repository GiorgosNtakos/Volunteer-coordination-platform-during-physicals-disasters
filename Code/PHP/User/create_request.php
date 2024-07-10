<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
require '../vendor/autoload.php';
$conn->set_charset("utf8");
use Ramsey\Uuid\Uuid;
session_start();

if (isset($_SESSION['user_auth']) && isset($_SESSION['item_id_auth'])){
    
    $user_id = $_SESSION['user_auth']['id'];
    $item_id = $_SESSION['item_id_auth'];

    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        if(isset($_POST['population'])){

            $desired_quantity=(int)$_POST['population'] * 2;

            $uuid = Uuid::uuid4();
            $task_id = mysqli_real_escape_string($conn,$uuid->toString());
            $type = "Request";

            $createRequest = $conn->prepare("INSERT INTO tasks (id, quantity, type, item_id, user_id) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?");
            $createRequest->bind_param("sisisi", $task_id, $desired_quantity, $type, $item_id, $user_id, $desired_quantity);
            $createRequest->execute();

            if ($createRequest->affected_rows > 0) {
                http_response_code(200);
                $response = array('status' => 'success', 'message' => 'Το αιτημά σας δημιουργήθηκε με επιτυχία.');
            } else {
                http_response_code(500);
                $response = array('status' => 'server_error', 'message' => 'Προέκυψε σφάλμα κατά τη δημιουργία της αίτησης.');
            }
        } else{
        http_response_code(400);
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
       }
    } else{
        http_response_code(405);
        $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
    }
} else{
    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Δεν υπήρχε σύνδεση χρήστη ή συνδεσή σας έληξε ή το id του αντικειμένου δεν ταυτοποιήθηκε.');
}

echo json_encode($response);
$createRequest->close();
$conn->close();

?>
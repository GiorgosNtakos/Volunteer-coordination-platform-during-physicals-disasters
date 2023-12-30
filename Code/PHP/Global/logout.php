<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');


session_start();

if (isset($_SESSION['admin_auth'])){
    if($_SERVER["REQUEST_METHOD"] === "POST"){
// Εκκαθάριση όλων των στοιχείων του session
$_SESSION = array();

// Καταστροφή του session
session_destroy();

http_response_code(200);

// Επιστροφή JSON απόκρισης
$response = array("status" => "success");

    } else{
        
        http_response_code(405); // Επιστροφή κωδικού σφάλματος 400
        $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
    }
} else{

    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Δεν υπήρχε σύνδεση χρήστη ή συνδεσή σας έληξε');
}

echo json_encode($response);
?>

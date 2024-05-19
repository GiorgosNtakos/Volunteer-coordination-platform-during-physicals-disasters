<?php 
session_start();
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");



 if (isset($_SESSION['user_auth'])){
    
    $user_name = $_SESSION['user_auth']['username'];
    
    $user_img = $_SESSION['user_auth']['image_path'];

    $user_type = $_SESSION['user_auth']['type'];
  
    if ($_SERVER["REQUEST_METHOD"] === "GET") {

            http_response_code(200);
            $response = array("status" => "success", "message" => "Τα δεδομενα ανακτηθηκαν με επιτυχια." , "username" => $user_name , "img_path" =>$user_img, "type"=> $user_type);
    }else {
    // Μη έγκυρη αίτηση
    http_response_code(405); // Επιστροφή κωδικού σφάλματος 400
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.". $conn->error);
} 
 } else {
    // Ο διαχειριστής δεν έχει συνδεθεί. Επιστρέψτε κάποιο προεπιλεγμένο όνομα ή μήνυμα.
    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Πρέπει να συνδεθείτε');
 }

echo json_encode($response);
$conn->close();
exit;
?>
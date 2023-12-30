<?php 
session_start();
header('Access-Control-Allow-Origin: http://127.0.0.1:5500'); 
header('Content-Type: application/json');
require 'db_connect.php';
$conn->set_charset("utf8");



 if (isset($_SESSION['admin_name'])){

    $admin_name = $_SESSION['admin_name'];
  
    if ($_SERVER["REQUEST_METHOD"] === "GET") {

        $sql = "SELECT admin_name, email, img_path FROM admins WHERE admin_name = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $admin_name);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $adminName = $row["admin_name"];
            $adminEmail = $row["email"];
            $adminPhoto = $row["img_path"];

            http_response_code(200);
            $response = array("status" => "success", "message" => "Τα στοιχεια του Διαχειριστη ανακτήθηκαν επιτυχώς απο τη βάση δεδομένων." , "admin_name" => $adminName , "email" => $adminEmail , "img_path" => $adminPhoto);

        } else if($result->num_rows === 0){
            http_response_code(404); // Επιστροφή κωδικού σφάλματος 500
            $response = array("status" => "not_found_404", "message" => "Δεν βρέθηκε Διαχειριστής με αυτό το όνομα:".$adminName. "ERROR:" . $conn->error);

        } else{
            http_response_code(500);
            $response = array("status" => "server_error", "message" => "Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.");
        }

        $stmt->close();

    } else{
        http_response_code(405); // Επιστροφή κωδικού σφάλματος 400
        $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.". $conn->error);
    }
 }else {
    // Ο διαχειριστής δεν έχει συνδεθεί. Επιστρέψτε κάποιο προεπιλεγμένο όνομα ή μήνυμα.
    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Πρέπει να συνδεθείτε');
 }

echo json_encode($response);
$conn->close();
?>
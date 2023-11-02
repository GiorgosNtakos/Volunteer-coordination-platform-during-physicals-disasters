<?php 
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: DELETE");
require 'db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === 'DELETE') {

    $sql = "DELETE FROM products";
    $stm = $conn->prepare($sql);

    if($stm->execute())
    {
        http_response_code(200);
        $response = array("status" => "success", "message" => "Διαγράφηκαν όλα τα προϊόντα επιτυχώς.");
        
    } else  {
        // Σφάλμα κατά την εισαγωγή
        http_response_code(500); // Επιστροφή κωδικού σφάλματος 500
        $response = array("status" => "server_500", "message" => "Σφάλμα κατά την διαγραφή: " . $conn->error);
         }

} else {
    // Μη έγκυρη αίτηση
    http_response_code(405); // Επιστροφή κωδικού σφάλματος 400
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.". $conn->error);

}

echo json_encode($response);
$conn->close();
?>
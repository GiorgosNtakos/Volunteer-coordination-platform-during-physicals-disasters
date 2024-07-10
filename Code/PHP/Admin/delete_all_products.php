<?php 
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: DELETE");
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === 'DELETE') {

    $sql_items = "DELETE FROM items";
    $stm_items = $conn->prepare($sql_items);

    $sql_stock = "DELETE FROM warehouse_stock";
    $stm_stock = $conn->prepare($sql_stock);

    if($stm_items->execute() && $stm_stock->execute())
    {
        http_response_code(200);
        $response = array("status" => "success", "message" => "Διαγράφηκαν όλα τα αντικειμενα και οι ποσοτητές τους επιτυχώς.");
        $stm_stock->close();
        $stm_items->close();
        
    } else  {
        http_response_code(500);
        $response = array("status" => "server_500", "message" => "Σφάλμα κατά την διαγραφή: " . $conn->error);
         }

} else {
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.". $conn->error);

}

echo json_encode($response);
$conn->close();
?>
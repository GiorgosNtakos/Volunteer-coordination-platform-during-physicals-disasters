<?php
session_start();
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");


if (isset($_SESSION['item_id_auth'])){

    $item_id = $_SESSION['item_id_auth'];

if ($_SERVER["REQUEST_METHOD"] === "POST") { 
    if(isset($_POST['name']) && isset($_POST['quantity']) && isset($_POST['category']) && isset($_POST['details'])){
        
        $itemName = $_POST['name'];
        $itemQuantity = $_POST['quantity'];
        $itemCategory = $_POST['category'];
        $itemDetails = $_POST['details'];

        $sql = "SELECT items.name, items.category_id, items.details, warehouse_stock.quantity AS quantity FROM items
        LEFT JOIN warehouse_stock ON warehouse_stock.item_id = items.id WHERE name = ? AND quantity = ? AND category_id = ? AND details = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("siis", $itemName, $itemQuantity, $itemCategory, $itemDetails);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            http_response_code(200);
            $response = array("status" => "success_but_no_changes", "message" =>"Δεν υπήρξε κάποια αλλαγή στις πληροφορίες του αντικειμένου");

        } else if($result->num_rows === 0){

            $stmt = $conn->prepare("UPDATE items JOIN warehouse_stock ON items.id = warehouse_stock.item_id SET items.name = ?, 
            items.category_id = ?, items.details = ?, warehouse_stock.quantity = ? WHERE items.id = ?");
            $stmt->bind_param("sisii", $itemName, $itemCategory, $itemDetails, $itemQuantity, $item_id);

            if ($stmt->execute()) {
                http_response_code(200);
                $response = array("status" => "success_change", "message" => "Οι πληροφορίες του είδους άλλαξαν επιτυχώς !");
        
            } else{
                http_response_code(500);
                $response = array("status" => "server_error", "message" => "Σφάλμα κατά την αλλαγη πληροφοριών του είδους.Δοκιμάστε ξανά.");
            }

        } else{

            http_response_code(500);
            $response = array("status" => "server_error" , "message" => "Σφάλμα κατά την ανάκτηση πληροφοριών του είδους: ");
        }

    } else{
        http_response_code(400);
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα PATCH.");
    }
} else{
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}
} else{
    http_response_code(401);
    $response = array("status" => "no_id_auth", "message" => 'Το id του προιόντος δεν τα ταυτοποιήθηκε');
}
echo json_encode($response);
$stmt->close();
$conn->close();
?>
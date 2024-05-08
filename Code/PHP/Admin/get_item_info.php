<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if(isset($_GET['itemName'])){

        $itemName = $_GET['itemName'];

        $sql = "SELECT id FROM items WHERE name = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $itemName);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $item_id = $result->fetch_assoc();
            session_start();
            $_SESSION['item_id_auth'] = $item_id['id'];

        $sql = "SELECT items.name, items.category_id, items.details, warehouse_stock.quantity AS quantity FROM items
        LEFT JOIN warehouse_stock ON warehouse_stock.item_id = items.id WHERE name = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $itemName);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $item_info = $result->fetch_assoc();

            http_response_code(200);
            $response = array("status" => "success", "message" =>"Οι πληροφορίες του είδους ανακτήθηκαν επιτιχώς", "item_info" => $item_info);
        } else if($result->num_rows === 0) {
            http_response_code(200);
            $response = array("status" => "success_but_empty" , "message" => "Δεν υπάρχει αντικείμενο αποθηκευμένο με αυτό το όνομα." . $conn->error);
        } else{
            http_response_code(500);
            $response = array("status" => "server_error" , "message" => "Σφάλμα κατά την ανάκτηση πληροφοριών του είδους: " . $conn->error);
        }

    }

    } else {
        // Αν λείπουν πεδία
        http_response_code(400);
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα GET.");
    }

}  else{
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

// Κλείσιμο της σύνδεσης με τη βάση δεδομένων
echo json_encode($response);
$stmt->close();
$conn->close();
?>
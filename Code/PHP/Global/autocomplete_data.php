<?php

header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if(isset($_GET['term'])){
        $searchTerm = $_GET['term'];
        $searchTerm = "%{$searchTerm}%";

        $sql  = "SELECT name FROM items WHERE name LIKE ?";
        $stmt = $conn->prepare($sql);
        $stmt ->bind_param('s', $searchTerm);
        $stmt ->execute();
        $results = $stmt->get_result();
        
        $items = $results->fetch_all(MYSQLI_ASSOC);
        echo json_encode($items);
        $stmt->close();
        $conn->close();
    } else {
        http_response_code(400);
        echo json_encode(array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα GET."));
        exit;
    }

} else {
    http_response_code(405);
    echo json_encode(array("status" => "wrong_method_405" , "message" => "Μη έγκυρη αίτηση."));
    exit;
} 

?>
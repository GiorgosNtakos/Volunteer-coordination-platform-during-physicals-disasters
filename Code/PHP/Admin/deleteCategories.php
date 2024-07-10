<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

// Parsing DELETE request data
parse_str(file_get_contents("php://input"), $_DELETE);

if ($_SERVER["REQUEST_METHOD"] === 'DELETE'){
if (isset($_DELETE['categories']) && !empty($_DELETE['categories'])) {
    $selectedCategories = [];
    $selectedCategories = explode(',', $_DELETE['categories']);

    $categories = implode(',', array_fill(0, count($selectedCategories), '?'));

    $sqlItems = "DELETE items, categories FROM items INNER JOIN categories ON items.category_id = categories.id WHERE items.category_id IN ($categories)";
    $stmtItems = $conn->prepare($sqlItems);
    $stmtItems->bind_param(str_repeat('i', count($selectedCategories)), ...$selectedCategories);
    
    if($stmtItems->execute()){
        http_response_code(200);
        $response = array("status" => "success", "message" => "Διαγράφηκαν οι κατηγορίες και τα αντικειμενα τους επιτυχώς.");
        $stmtItems->close();
    } else  {
        http_response_code(500);
        $response = array("status" => "server_500", "message" => "Σφάλμα κατά την διαγραφή: " . $conn->error);
         }     
    } else{
        http_response_code(400);
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα DELETE.");
    }   
} else{
    http_response_code(405);
    $response = array("status" => "wrong_method_405" , "message" => "Μη έγκυρη αίτηση.");
}

echo json_encode($response);
$conn->close();
?>
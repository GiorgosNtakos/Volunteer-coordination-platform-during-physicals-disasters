<?php

header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if(isset($_GET['id']))
    {

        $announcement_id = $_GET['id'];

        $sql = "SELECT items.id, items.name FROM Items 
        INNER JOIN announcementitems  ON items.id = announcementitems.item_id
        WHERE announcementitems.announcement_id = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $announcement_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $items = [];

        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
        $response = array("items" => $items);
    } else {
        // Αν λείπουν πεδία
        http_response_code(400);
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα GET.");
    }

} else {
    http_response_code(405);
    $response = array("status" => "wrong_method_405" , "message" => "Μη έγκυρη αίτηση.");
} 

echo json_encode($response);
$stmt->close();
$conn->close();
?>

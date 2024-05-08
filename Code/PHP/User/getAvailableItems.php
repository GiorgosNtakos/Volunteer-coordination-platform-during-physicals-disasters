<?php

header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if(isset($_GET['page']) && isset($_GET['per_page']))
    {
        $page = (int)$_GET['page'];
        $per_page = (int) $_GET['per_page'];
        $searchTerm = isset($_GET['searchTerm']) && !empty($_GET['searchTerm']) ? $_GET['searchTerm'] : null;
        $selectedCategories = isset($_GET['categories']) && !empty($_GET['categories']) ? explode(',', $_GET['categories']) : [];

        
        $whereClause = '';
        $bindTypes = '';
        $bindValues = array();

        if (!empty($selectedCategories)) {
            $whereClause .= "categories.category_name IN (" . implode(',', array_fill(0, count($selectedCategories), '?')) . ")";
            $bindTypes .= str_repeat('s', count($selectedCategories));
            $bindValues = array_merge($bindValues, $selectedCategories);
        } else {
            http_response_code(200);
        $response = array("status" => "no_filters", "message" => "Δεν εχει επιλεχθεί κάποιο φίλτρο." );
        }

        $searchTerm = isset($_GET['searchTerm']) && !empty($_GET['searchTerm']) ? $_GET['searchTerm'] : null;
        if ($searchTerm !== null) {
            $whereClause .= ($whereClause ? " AND" : "") . " items.name LIKE ?";
            $bindTypes .= 's';
            $bindValues[] = "%{$searchTerm}%";
        }

        if (!empty($whereClause)) {
            $whereClause = "WHERE $whereClause AND warehouse_stock.quantity > 0";
        } else {
            $whereClause = "WHERE warehouse_stock.quantity > 0";
        }
        

        $count_sql = "SELECT COUNT(*) AS total FROM items
        LEFT JOIN categories ON items.category_id = categories.id
        LEFT JOIN warehouse_stock ON items.id = warehouse_stock.item_id
        $whereClause";

        $stmt = $conn->prepare($count_sql);
        if (!empty($bindValues)) {
            $stmt->bind_param($bindTypes, ...$bindValues);
        }
        $stmt->execute();
        $count_result = $stmt->get_result();
        $total_count = $count_result->fetch_assoc()['total'];

        $start = ($page - 1) * $per_page;

        $sql = "SELECT items.id, items.name, categories.category_name AS category, items.details FROM items
        LEFT JOIN categories ON items.category_id = categories.id
        LEFT JOIN warehouse_stock ON items.id = warehouse_stock.item_id
        $whereClause
        LIMIT ?, ?";

        $bindTypes .= 'ii';
        $bindValues[] = $start;
        $bindValues[] = $per_page;

        $stmt = $conn->prepare($sql);

        $stmt->bind_param($bindTypes, ...$bindValues);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $items = array();
        
            while ($row = $result->fetch_assoc()) {
                $items[] = $row;
            }
        
            http_response_code(200);
            $response = array(
                "status" => "success",
                "message" => "Επιτυχής ανάκτηση αντικειμένων από την βάση δεδομένων",
                "total_count" => $total_count,
                "items" => $items
            );

        } else if($result->num_rows === 0) {
            http_response_code(200);
            $response = array("status" => "success_but_empty" , "message" => "Δεν υπάρχουν αντικείμενα αποθηκευμένα." . $conn->error);
        } else{
            http_response_code(500);
            $response = array("status" => "server_error" , "message" => "Σφάλμα κατά την ανάκτηση των αντικειμένων: " . $conn->error);
        }
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
$conn->close()
?>
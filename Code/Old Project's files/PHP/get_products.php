<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require 'db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $page = isset($_GET["page"]) && $_GET["page"] !== '' ? (int)$_GET["page"] : null;
    $per_page = isset($_GET["per_page"]) && $_GET["per_page"] !== '' ? (int)$_GET["per_page"] : null;
    $category = isset($_GET["category"]) && $_GET["category"] !== '' ? $_GET["category"] : null;
    $subcategory = isset($_GET["subcategory"]) && $_GET["subcategory"] !== '' ? $_GET["subcategory"] : null;
    $searchTerm = isset($_GET["searchTerm"]) && $_GET["searchTerm"] !== '' ? $_GET["searchTerm"] : null;

    $whereClause = '';
    $bindTypes = '';
    $bindValues = array();

    if ($category !== null && $subcategory !== null) {
        $whereClause = "WHERE categories.name = ? AND subcategories.name = ?";
        $bindTypes = 'ss';
        $bindValues = array($category, $subcategory);
    } elseif ($category !== null) {
        $whereClause = "WHERE categories.name = ?";
        $bindTypes = 's';
        $bindValues = array($category);
    } elseif ($subcategory !== null) {
        $whereClause = "WHERE subcategories.name = ?";
        $bindTypes = 's';
        $bindValues = array($subcategory);
    } else {
        http_response_code(200);
        $response = array("status" => "no_filters", "message" => "Δεν εχει επιλεχθεί κάποιο φίλτρο." );
    }

    if ($searchTerm !== null) {
        if (!empty($whereClause)) {
            $whereClause .= " AND";
        } else {
            $whereClause = "WHERE";
        }
        $whereClause .= " products.name LIKE ?";
        $bindTypes .= 's';
        $bindValues[] = "%" . $searchTerm . "%";
    } else {
        http_response_code(200);
        $response = array("status" => "no_search_term", "message" => "Δεν έχει κάποιο όρο στο search bar." );
    }

    $count_sql = "SELECT COUNT(*) AS total FROM products
                  LEFT JOIN categories ON products.category_id = categories.category_id
                  LEFT JOIN subcategories ON products.subcategory_id = subcategories.subcategory_id
                  $whereClause";

    $stmt = $conn->prepare($count_sql);
    if (!empty($bindValues)) {
        $stmt->bind_param($bindTypes, ...$bindValues);
    }
    $stmt->execute();
    $count_result = $stmt->get_result();
    $total_count = $count_result->fetch_assoc()['total'];

    $start = ($page - 1) * $per_page;

    $sql = "SELECT products.product_id, products.name, categories.name AS category, subcategories.name AS subcategory, products.price
            FROM products
            LEFT JOIN categories ON products.category_id = categories.category_id
            LEFT JOIN subcategories ON products.subcategory_id = subcategories.subcategory_id
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
        $products = array();

        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }

        http_response_code(200);
        $response = array(
            "status" => "success",
            "message" => "Επιτυχής ανάκτηση προϊόντων από την βάση δεδομένων",
            "total_count" => $total_count,
            "products" => $products
        );
        
    } else if($result->num_rows === 0) {
        http_response_code(200);
        $response = array("status" => "success_but_empty" , "message" => "Δεν υπάρχουν προϊόντα αποθηκευμένα." . $conn->error);
    } else{
        http_response_code(500);
        $response = array("status" => "server_error" , "message" => "Σφάλμα κατά την ανάκτηση των προϊόντων: " . $conn->error);
}
} 
else {
    http_response_code(405);
    $response = array("status" => "wrong_method_405" , "message" => "Μη έγκυρη αίτηση.");
}

echo json_encode($response);
$stmt->close();
$conn->close();
?>

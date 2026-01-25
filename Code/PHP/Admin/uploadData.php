<?php
//* CHANGE THE NAME OF FILE AFTER FINISHED

header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

// Έλεγχος για την ύπαρξη των δεδομένων από το FormData
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
  if (isset($_POST['loadType'])) {
    $loadType = $_POST['loadType'];

    if ($loadType === "url" && isset($_POST['jsonUrl'])) {
        $jsonUrl = $_POST['jsonUrl'];
        $jsonData = file_get_contents($jsonUrl);
    } elseif ($loadType === "file" && isset($_FILES['jsonFile'])) {
        // Έλεγχος ασφαλείας για τη μεταφόρτωση αρχείων
        if ($_FILES["jsonFile"]["error"] === UPLOAD_ERR_OK) {
            $uploadDir = "../../../upload_data_files/";
            $uploadFile = $uploadDir . basename($_FILES['jsonFile']['name']);

            if (move_uploaded_file($_FILES['jsonFile']['tmp_name'], $uploadFile)) {
                $jsonData = file_get_contents($uploadFile);
            } else {
                http_response_code(500);
                $response = array('status' => 'server_error', 'message' => 'Υπήρξε κάποιο πρόβλημα κατά τη μετακίνηση του αρχείου.Παρακαλώ δοκιμάστε ξανά') ;
                echo json_encode($response);
                $conn->close();
                exit;
            }
        } else {
            http_response_code(400);
            $response = array('status' => 'missing_400', 'message' => 'Tο αρχείο ή το url λείπει από το αίτημα POST.') ;
            echo json_encode($response);
            $conn->close();
            exit;
        }
    } else {
            http_response_code(400);
            $response = array('status' => 'missing_400', 'message' => 'Σφάλμα κατά τη μεταφόρτωση του αρχείου.') ;
            echo json_encode($response);
            $conn->close();
            exit;
    }

    // Ανάλυση των JSON δεδομένων
    $data = json_decode($jsonData, true);
    $forbiddenCategories = array(10, 13, 9, 8, 15, 11, 39);

    // Εισαγωγή δεδομένων στη βάση
    foreach ($data['items'] as $item) {
        $item_id = $item['id'];
        $category_id = $item['category'];
        $name = $item['name'];
        $detailsArray = $item['details'];
        $detailsString = '';

        foreach ($detailsArray as $detail) {
            // Make sure $detail is an array and has 'detail_name' and 'detail_value'
            if (is_array($detail) && isset($detail['detail_name']) && isset($detail['detail_value']) && !empty($detail['detail_name']) && !empty($detail['detail_value'])) {
                $detailName = $detail['detail_name'];
                $detailValue = $detail['detail_value'];
                $detailsString .= $detailName . ': ' . $detailValue;
                if (next($detailsArray)) {
                    $detailsString .= ",\n ";
                }
            }
        }
    

        // Αντικαθιστούμε τα δεδομένα των details με το νέο string
        $item['details'] = $detailsString;
        $details = $item['details'];

        if(!in_array($item['category'], $forbiddenCategories)){
            $sql = "INSERT IGNORE INTO Items (id, name, category_id, details) VALUES ('$item_id', '$name', $category_id, '$details')";
            $conn->query($sql);
        }
    }

    foreach ($data['categories'] as $category) {
        $category_id = $category['id'];
        $category_name = $category['category_name'];

        if(!in_array($category['id'], $forbiddenCategories)){
            $sql = "INSERT IGNORE INTO Categories (id, category_name) VALUES ('$category_id', '$category_name')";
            $conn->query($sql);
        }
    }

    $categoriesQuery = "SELECT * FROM categories";
    $itemsQuery = "SELECT * FROM items";

    $categoriesResult = $conn->query($categoriesQuery);
    $itemsResult = $conn->query($itemsQuery);

    $allData = array(
        "categories" => $categoriesResult->fetch_all(MYSQLI_ASSOC),
        "items" => $itemsResult->fetch_all(MYSQLI_ASSOC)
    );

    http_response_code(201);
    $response = array("status" => "data_created", "message" => "Τα δεδομένα έχουν αποθηκευτεί με επιτυχία στη βάση δεδομένων.", "data" => $allData);

} else {
    // Μήνυμα λάθους αν τα αναμενόμενα δεδομένα δεν υπάρχουν
    http_response_code(400);
    $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
 }

} else {
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

echo json_encode($response);
$conn->close();
?>
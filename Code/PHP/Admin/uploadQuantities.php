<?php

header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
require '../vendor/autoload.php';
$conn->set_charset("utf8");
use Ramsey\Uuid\Uuid;

// Έλεγχος για την ύπαρξη των δεδομένων από το FormData
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST['loadTypeQuantities'])) {
        $loadTypeQuantities = $_POST['loadTypeQuantities'];
        $sql = "SELECT id FROM warehouse";
        $row = $conn->query($sql)->fetch_assoc();
        $warehouse_id = $row['id'];

        if ($loadTypeQuantities === "rng"){

            $sql = "SELECT id FROM Items";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $item_id = $row['id'];
                    $quantity = mt_rand(100, 1000);

                    $checkSql = "SELECT id FROM warehouse_Stock WHERE item_id = ? AND warehouse_id = ?";
                    $checkStmt = $conn->prepare($checkSql);
                    $checkStmt->bind_param("is", $item_id, $warehouse_id);
                    $checkStmt->execute();
                    $resultCheck = $checkStmt->get_result();

                    if ($resultCheck->num_rows > 0) {
                        // Update existing record
                        $updateSql = "UPDATE warehouse_Stock SET quantity = ? WHERE item_id = ? AND warehouse_id = ?";
                        $updateStmt = $conn->prepare($updateSql);
                        $updateStmt->bind_param("iis", $quantity, $item_id, $warehouse_id);
                    } else{
                        $uuid = Uuid::uuid4();
                        $quantity_id = mysqli_real_escape_string($conn, $uuid->toString());
                        $insertSql = "INSERT INTO warehouse_Stock (id, quantity, item_id, warehouse_id) VALUES (?, ?, ?, ?)";
                        $updateStmt = $conn->prepare($insertSql);
                        $updateStmt->bind_param("siis", $quantity_id, $quantity, $item_id, $warehouse_id);
                    }


                    if ($updateStmt->execute()) {
                        // Η εγγραφή ήταν επιτυχής
                        http_response_code(201);
                        $response = array("status" => "created", "message" => "Επιτυχής εισαγωγή της ποσότητας των αντικειμένων!");
            
                        } else {
                            // Η εγγραφή απέτυχε
                            http_response_code(500);
                            $response = array("status" => "server_error", "message" => "Η εισαγωγή απέτυχε. Παρακαλώ δοκιμάστε ξανά.". $conn->error);
                            }

                    $updateStmt->close();
                    $checkStmt->close();
                } 
            } else if($result->num_rows === 0) {
                http_response_code(200);
                $response = array("status" => "success_but_empty" , "message" => "Δεν υπάρχουν αντικείμενα αποθηκευμένα." . $conn->error);
            } else{
                http_response_code(500);
                $response = array("status" => "server_error" , "message" => "Σφάλμα κατά την ανάκτηση των αντικειμένων: " . $conn->error);
            }
        } elseif ($loadTypeQuantities === "file" && isset($_FILES['jsonFileQuantities'])) {
                // Έλεγχος ασφαλείας για τη μεταφόρτωση αρχείων
                if ($_FILES["jsonFileQuantities"]["error"] === UPLOAD_ERR_OK) {
                    $uploadDir = "../../../upload_data_files/";
                    $uploadFile = $uploadDir . basename($_FILES['jsonFileQuantities']['name']);
                
                    if (move_uploaded_file($_FILES['jsonFileQuantities']['tmp_name'], $uploadFile)) {
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
                    $response = array('status' => 'missing_400', 'message' => 'Tο αρχείο λείπει από το αίτημα POST.') ;
                    echo json_encode($response);
                    $conn->close();
                    exit;
                }

                $data = json_decode($jsonData, true);

                foreach ($data['items_quantities'] as $item_quantity) {
                    $id = $item_quantity['id'];
                    $quantity = $item_quantity['quantity'];
                    $item_id = $item_quantity['item_id'];
                    
                    $sql = "INSERT IGNORE INTO warehouse_stock (id, quantity, item_id, warehouse_id) VALUES (?, ?, ?, ?)";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("siis", $id, $quantity, $item_id, $warehouse_id);

                    if ($stmt->execute()) {
                        http_response_code(201);
                        $response = array("status" => "created", "message" => "Επιτυχής εισαγωγή της ποσότητας των αντικειμένων!");
                    } else {
                        http_response_code(500);
                        $response = array("status" => "server_error", "message" => "Η εισαγωγή απέτυχε. Παρακαλώ δοκιμάστε ξανά.". $conn->error);  
                    }
                }
        } else {
                http_response_code(400);
                $response = array('status' => 'missing_400', 'message' => 'Σφάλμα κατά τη μεταφόρτωση του αρχείου.') ;
                echo json_encode($response);
                $conn->close();
                exit;
        } 
    } else {
        // Αν λείπουν πεδία
        http_response_code(400);
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
    }
} else {
    http_response_code(405);
    $response = array("status" => "wrong_method_405" , "message" => "Μη έγκυρη αίτηση.");
}

error_log("Response: " . print_r($response, true));

echo json_encode($response);
$conn->close();
?>
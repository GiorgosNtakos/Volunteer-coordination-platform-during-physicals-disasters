<?php

header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['category_name'])){

        $categoryName = $_POST['category_name'];

        // Ελέγχουμε αν υπάρχει ήδη η κατηγορία στη βάση
        $stmt = $conn->prepare("SELECT id FROM Categories WHERE category_name = ?");
        $stmt->bind_param("s", $categoryName);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            http_response_code(409);
            $response = array("status" => "exists", "message" => "Η κατηγορία υπάρχει ήδη και δεν μπορεί να προστεθεί εκ νέου.");
        } else {
            // Προσθήκη της νέας κατηγορίας στη βάση
            $stmt = $conn->prepare("INSERT INTO Categories (category_name) VALUES (?)");
            $stmt->bind_param("s", $categoryName);
            if ($stmt->execute()) {
                http_response_code(201);
                $response = array("status" => "created", "message" => "H νέα κατηγορία προστέθηκε επιτυχώς !");
            } else {
                http_response_code(500);
                $response = array("status" => "server_error", "message" => "Σφάλμα κατά την εισαγωγή της νέας κατηγορίας: " . $conn->error);
            }   
        }
    } else{
        http_response_code(400);
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
    }
} else{
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

echo json_encode($response);
$stmt -> close();
$conn->close();
?>
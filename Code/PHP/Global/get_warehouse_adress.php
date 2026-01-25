<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");


if ($_SERVER["REQUEST_METHOD"] === "GET") {

     // Ανάκτηση συντεταγμένων της αποθήκης (υποθέτοντας μία αποθήκη για απλότητα)
     $stmtWarehouseLocation = $conn->prepare("SELECT location_lat, location_lon, street, town, number FROM warehouse LIMIT 1");
     $stmtWarehouseLocation->execute();
     $resultWarehouseLocation = $stmtWarehouseLocation->get_result();

     if ($resultWarehouseLocation->num_rows > 0) {
        // Εάν υπάρχουν αποτελέσματα, επιστρέφουμε την πρώτη εγγραφή
        $warehouseLocation = $resultWarehouseLocation->fetch_assoc();
        $response = array(
            'status' => 'success',
            'message' => 'Οι συνεταγμενες της Βάσης ανακτήθηκαν επιτυχώς.',
            'cordinates' => $warehouseLocation // Ενσωμάτωση της απόστασης στο response
        );
      } else {
        $response = array(
            'status' => 'server_error',
            'message' => 'Λάθος κατά την ανάκτηση δεδομένων της Βάσης. Παρακαλώ δοκιμάστε ξανά',
        );
    }

} else{
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

$stmtWarehouseLocation->close();
echo json_encode($response);
$conn->close();
?>
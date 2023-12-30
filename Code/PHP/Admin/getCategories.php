<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // Ερώτημα SQL για ανάκτηση των κατηγοριών
    $sql = "SELECT * FROM Categories";
    $result = $conn->query($sql);

    // Έλεγχος εάν υπάρχουν εγγραφές
    if ($result->num_rows > 0) {
        // Αν υπάρχουν, επιστροφή των δεδομένων σε μορφή JSON
        $categories = array();
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }

        http_response_code(200);
        $response = array("status" => "success", "message" =>"Οι κατηγορίες ανακτήθηκαν επιτιχώς", "categories" => $categories);
        
    } else if($result->num_rows === 0) {
        http_response_code(200);
        $response = array("status" => "success_but_empty" , "message" => "Δεν υπάρχουν διαθέσιμες κατηγορίες." . $conn->error);
    } else{
        http_response_code(500);
        $response = array("status" => "server_error" , "message" => "Σφάλμα κατά την ανάκτηση των κατηγοριών: " . $conn->error);
    }
} else{
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

// Κλείσιμο της σύνδεσης με τη βάση δεδομένων
echo json_encode($response);
$conn->close();
?>
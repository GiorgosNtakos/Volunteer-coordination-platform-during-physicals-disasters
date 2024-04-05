<?php
//! προσθηκη καποιου flag σε περιπτωση που δεν υπαρχει ορος στο searchTerm και δημιουργια νεου μηνυματος αν το flag εινα ενεργο
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $sql = "SELECT id, name, street, number, town, assigned_rescuers AS crew FROM vehicles WHERE assigned_rescuers < 2";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {

        $vehicles = array();

        while ($row = $result->fetch_assoc()) {
            $vehicles[] = $row;
        }

        http_response_code(200);
        $response = array(
            "status" => "success",
            "message" => "Επιτυχής ανάκτηση διαθέσιμων οχημάτων από την βάση δεδομένων",
            "vehicles" => $vehicles
        );
    } else if($result->num_rows === 0) {
        http_response_code(200);
        $response = array("status" => "success_but_empty" , "message" => "Δεν υπάρχουν διαθέσιμα οχήματα." . $conn->error);
    } else{
        http_response_code(500);
        $response = array("status" => "server_error" , "message" => "Σφάλμα κατά την ανάκτηση των διαθέσιμων οχημάτων: " . $conn->error);
    }

} else {
    http_response_code(405);
    $response = array("status" => "wrong_method_405" , "message" => "Μη έγκυρη αίτηση.");
}

echo json_encode($response);
$stmt->close();
$conn->close();
?>
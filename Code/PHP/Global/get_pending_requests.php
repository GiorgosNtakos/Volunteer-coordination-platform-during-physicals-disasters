<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require '../Global/db_connect.php'; // Αντικαταστήστε με την πραγματική διαδρομή του αρχείου σας για σύνδεση στην βάση δεδομένων
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $status = 'pending';
    $type = 'Request';

$sql = "SELECT tasks.id, tasks.quantity, tasks.status, users.username, users.location_lat, users.location_lon 
        FROM Tasks 
        LEFT JOIN Users ON tasks.user_id = users.id 
        WHERE tasks.status = ? AND tasks.type = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $status, $type);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $requests = array();

    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }
    http_response_code(200);
    $response = array("status" => "success", "requests" => $requests);
} else if($result->num_rows === 0) {
    http_response_code(200);
    $response = array("status" => "success_but_empty", "message" => "Δεν βρέθηκαν εκκρεμείς προσφορές.");
} else {
    http_response_code(500);
    $response = array("status" => "server_error", "message" => "Σφάλμα κατά την ανάκτηση προσφορών.");
}
} else{
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

echo json_encode($response);
$stmt->close();
$conn->close();
?>

<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if(isset($_GET['start_date']) && isset($_GET['end_date'])){
    $start_date = $_GET['start_date'].' 00:00:00';
    $end_date = $_GET['end_date'].' 23:59:59';

    $statistics = [
        "new_requests" => 0,
        "new_offers" => 0,
        "completed_requests" => 0,
        "completed_offers" => 0
    ];

    // Νέα αιτήματα
    $sql = "SELECT COUNT(*) as count FROM Tasks WHERE type = 'Request' AND status != 'completed' AND created_at BETWEEN ? AND ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $start_date, $end_date);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $statistics["new_requests"] = $row["count"];

    // Νέες προσφορές
    $sql = "SELECT COUNT(*) as count FROM Tasks WHERE type = 'Offer' AND status != 'completed' AND created_at BETWEEN ? AND ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $start_date, $end_date);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $statistics["new_offers"] = $row["count"];

    // Ολοκληρωμένα αιτήματα
    $sql = "SELECT COUNT(*) as count FROM Tasks WHERE type = 'Request' AND status = 'completed' AND created_at BETWEEN ? AND ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $start_date, $end_date);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $statistics["completed_requests"] = $row["count"];

    // Ολοκληρωμένες προσφορές
    $sql = "SELECT COUNT(*) as count FROM Tasks WHERE type = 'Offer' AND status = 'completed' AND created_at BETWEEN ? AND ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $start_date, $end_date);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $statistics["completed_offers"] = $row["count"];

    http_response_code(200);
    $response = array('status' => 'success', 'statistics' => $statistics);
 } else{
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

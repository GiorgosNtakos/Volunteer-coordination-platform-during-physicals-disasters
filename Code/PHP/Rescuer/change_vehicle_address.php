<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
session_start();
require '../Global/db_connect.php';

$response = array();

if (isset($_SESSION['user_auth'])) {
    $user_id = $_SESSION['user_auth']['id'];

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if(isset($_POST['location_lat']) && isset($_POST['location_lon']) && isset($_POST['street']) && isset($_POST['number']) && isset($_POST['town'])){

        $location_lat = $_POST['location_lat'];
        $location_lon = $_POST['location_lon'];
        $street = $_POST['street'];
        $number = $_POST['number'];
        $town = $_POST['town'];

        $sql = "UPDATE Vehicles v
                JOIN VehicleAssignments va ON v.id = va.vehicle_id
                SET v.location_lat = ?, v.location_lon = ?, v.street = ?, v.number = ?, v.town = ?
                WHERE va.user_id = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ddsiss", $location_lat, $location_lon, $street, $number, $town, $user_id);

        if ($stmt->execute()) {
            http_response_code(200);
            $response = array("status" => "success", "message" => "Η τοποθεσία του οχήματος ενημερώθηκε επιτυχώς.");
        } else {
            http_response_code(500);
            $response = array("status" => "server_error", "message" => "Δεν ήταν δυνατή η ενημέρωση της τοποθεσίας.");
        }
    
        $stmt->close();

    } else{
        http_response_code(400);
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
    }
} else{
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}
} else {
    $response = array("status" => "unauthorized", "message" => "User is not authenticated.");
    http_response_code(401);
}

echo json_encode($response);
$conn->close();
?>
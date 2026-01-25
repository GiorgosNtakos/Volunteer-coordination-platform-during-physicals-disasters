<?php
// Προσθέστε το αρχείο σύνδεσης στη βάση δεδομένων
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
//header("Access-Control-Allow-Methods: PUT");
require '../Global/db_connect.php';
$conn->set_charset("utf8");


//parse_str(file_get_contents("php://input"), $_POST);


// Ελέγξτε αν το αίτημα είναι POST
if ($_SERVER["REQUEST_METHOD"] === "POST") { 
    if(isset($_POST['location_lat']) && isset($_POST['location_lon']) && isset($_POST['street']) && isset($_POST['number']) && isset($_POST['town'])){

        $location_lat = $_POST['location_lat'];
        $location_lon = $_POST['location_lon'];
        $street = $_POST['street'];
        $number = $_POST['number'];
        $town = $_POST['town'];

        $base_id = 'cdc4c156-a4e6-4fce-b72b-c147b2908d02';

        $sql = "UPDATE Warehouse SET location_lat=?, location_lon=?, street=?, number=?, town=? WHERE id= ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ddsiss", $location_lat, $location_lon, $street, $number, $town, $base_id);

        if ($stmt->execute()) {
            http_response_code(200);
            $response = array("status" => "success", "message" => "Η τοποθεσία της βάσης ενημερώθηκε επιτυχώς.");
        } else {
            http_response_code(500);
            $response = array("status" => "server_error", "message" => "Δεν ήταν δυνατή η ενημέρωση της τοποθεσίας.");
        }
    
        $stmt->close();

    } else{
        // Αν λείπουν πεδία
        http_response_code(400);
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
    }
} else{
    // Αν η αίτηση δεν είναι POST
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

echo json_encode($response);
$conn->close();
?>
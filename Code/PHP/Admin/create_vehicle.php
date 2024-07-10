<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
require '../vendor/autoload.php';
$conn->set_charset("utf8");

use Ramsey\Uuid\Uuid;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ( 
        isset($_POST['full_name']) &&  
        isset($_POST['street']) && 
        isset($_POST['number'])  && 
        isset($_POST['town']) && 
        isset($_POST['location_lat']) && 
        isset($_POST['location_lon'])
    ) {
        $vehicle_name = $_POST['full_name'];
        $street = $_POST['street'];
        $number = $_POST['number'];
        $town = $_POST['town'];
        $location_lat = $_POST['location_lat'];
        $location_lon = $_POST['location_lon'];

        $uuid = Uuid::uuid4();
        $vehicle_id = mysqli_real_escape_string($conn,$uuid->toString());
        
            $query = $conn->prepare("INSERT INTO vehicles (id, name, street, number, town, location_lat, location_lon) 
                                     VALUES (?, ?, ?, ?, ?, ?, ?)");

            $query->bind_param("sssisdd", $vehicle_id, $vehicle_name, $street, $number, $town, $location_lat, $location_lon);

            $result = $query->execute();

            if ($result) {
                http_response_code(201);
                $response = array("status" => "created", "message" => "Η προσθήκη νέου οχήματος ήταν επιτυχής");
                
            } else {
                http_response_code(500);
                $response = array("status" => "server_error", "message" => "Η προσθήκη απέτυχε. Παρακαλώ δοκιμάστε ξανά." . $conn->error);
            }

            $query->close();
    } else {
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
<?php
// ! Δεν το ενεργοποιω ακομα για να μπορω να δουλευω το live server
// ! Επισης πρεπει να βρουμε μια λυση για duplicates usernames,phones,ονομ/νυμα,emails(κυριως username, ονομ/νυμα).Να λαβουμε και υποψι αν χρειαστει λυση με το τυπο του καθε χρήστη
/*
if(empty($_SERVER["HTTPS"]) || $_SERVER["HTTPS"] !== "on"){
    header("Location: https://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]);
    exit();
}
*/

header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
require '../vendor/autoload.php';
$conn->set_charset("utf8");

use Ramsey\Uuid\Uuid;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ελέγχουμε αν έχουν παραληφθεί τα απαραίτητα πεδία
    if ( 
        isset($_POST['full_name']) &&  
        isset($_POST['street']) && 
        isset($_POST['number'])  && 
        isset($_POST['town']) && 
        isset($_POST['location_lat']) && 
        isset($_POST['location_lon'])
    ) {
        // Παίρνουμε τις τιμές από το POST request
        $vehicle_name = $_POST['full_name'];
        $street = $_POST['street'];
        $number = $_POST['number'];
        $town = $_POST['town'];
        $location_lat = $_POST['location_lat'];
        $location_lon = $_POST['location_lon'];

        $uuid = Uuid::uuid4();
        $vehicle_id = mysqli_real_escape_string($conn,$uuid->toString());
        
            // Προετοιμασμένη δήλωση για την εισαγωγή νέου διασωστή
            $query = $conn->prepare("INSERT INTO vehicles (id, name, street, number, town, location_lat, location_lon) 
                                     VALUES (?, ?, ?, ?, ?, ?, ?)");

            // Σύνδεση των παραμέτρων με τις τιμές
            $query->bind_param("sssisdd", $vehicle_id, $vehicle_name, $street, $number, $town, $location_lat, $location_lon);

            // Εκτέλεση της δήλωσης
            $result = $query->execute();

            if ($result) {
                // Επιτυχής εισαγωγή
                http_response_code(201);
                $response = array("status" => "created", "message" => "Η προσθήκη νέου οχήματος ήταν επιτυχής");
                
            } else {
                // Ανεπιτυχής εισαγωγή
                http_response_code(500);
                $response = array("status" => "server_error", "message" => "Η προσθήκη απέτυχε. Παρακαλώ δοκιμάστε ξανά." . $conn->error);
            }

            // Κλείσιμο της προετοιμασμένης δήλωσης
            $query->close();
    } else {
        // Αν λείπουν πεδία
        http_response_code(400);
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
    }
} else {
    // Αν η αίτηση δεν είναι POST
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

echo json_encode($response);
$conn->close();
?>
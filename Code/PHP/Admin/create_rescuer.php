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
require 'C:\wamp64\www\webproject\Code\PHP\vendor\autoload.php';
$conn->set_charset("utf8");

use Ramsey\Uuid\Uuid;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ελέγχουμε αν έχουν παραληφθεί τα απαραίτητα πεδία
    if ( 
        isset($_POST['full_name']) && isset($_POST['phone']) && 
        isset($_POST['street']) && isset($_POST['number'])  && 
        isset($_POST['town']) && isset($_POST['location_lat']) &&
        isset($_POST['location_lon']) && isset($_POST['username']) &&
        isset($_POST['password']) && isset($_POST['email'])
    ) {
        // Παίρνουμε τις τιμές από το POST request
        $username = $_POST['username'];
        $password = $_POST['password'];
        $email = $_POST['email'];
        $full_name = $_POST['full_name'];
        $phone = $_POST['phone'];
        $street = $_POST['street'];
        $number = $_POST['number'];
        $town = $_POST['town'];
        $location_lat = $_POST['location_lat'];
        $location_lon = $_POST['location_lon'];

        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $checkUsernameResult = $stmt->get_result();

        if($checkUsernameResult->num_rows > 0)
        {
            $counter = 1;
            while($checkUsernameResult->num_rows > 0)
            {
                $stmt->close();

                $counter++;
                $newUsername = $username . "#" . $counter;
                $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
                $stmt->bind_param("s", $newUsername);
                $stmt->execute();
                $checkUsernameResult = $stmt->get_result();
            }
            $username = $newUsername;
            $email = $newUsername . '@VolunteersInAction.gr';
            $stmt -> close();
        }

        $checkPhoneQuery = "SELECT * FROM users WHERE phone= ?";
        $stmt_check_phone = $conn->prepare($checkPhoneQuery);
        $stmt_check_phone->bind_param("s", $phone );
        $stmt_check_phone->execute();
        $result_phone = $stmt_check_phone->get_result();

        if($result_phone->num_rows > 0){
            http_response_code(409);
            $response = array ("status" => "exists_phone", "message" => "Ο αριθμός του κινητού τηλεφώνου υπάρχει ήδη! Παρακαλώ δοκιμάστε ξανά.");
            $stmt_check_phone ->close();
        } else {

        $uuid = Uuid::uuid4();
        $rescuer_id = mysqli_real_escape_string($conn,$uuid->toString());
        $type = "Rescuer";
        
            // Προετοιμασμένη δήλωση για την εισαγωγή νέου διασωστή
            $query = $conn->prepare("INSERT INTO users (id, username, password, full_name, phone, street, number, town, type, location_lat, location_lon, email) 
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            // Κρυπτογράφηση του κωδικού πρόσβασης
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            // Σύνδεση των παραμέτρων με τις τιμές
            $query->bind_param("ssssssissdds", $rescuer_id, $username, $hashed_password, $full_name, $phone, $street, $number, $town, $type, $location_lat, $location_lon, $email);

            // Εκτέλεση της δήλωσης
            $result = $query->execute();

            if ($result) {
                // Επιτυχής εισαγωγή
                http_response_code(201);
                $response = array("status" => "created", "message" => "Η δημιουργία λογαριασμού του Διασώστη ήταν επιτυχής");
                
            } else {
                // Ανεπιτυχής εισαγωγή
                http_response_code(500);
                $response = array("status" => "server_error", "message" => "Η εγγραφή απέτυχε. Παρακαλώ δοκιμάστε ξανά." . $conn->error);
            }

            // Κλείσιμο της προετοιμασμένης δήλωσης
            $query->close();
        }
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
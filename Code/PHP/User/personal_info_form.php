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
$conn->set_charset("utf8");

session_start();

if (isset($_SESSION['user_auth'])){

    $user_id = $_SESSION['user_auth']['id'];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Ελέγχουμε αν έχουν παραληφθεί τα απαραίτητα πεδία
        if (isset($_POST['full_name']) && isset($_POST['phone']) && 
            isset($_POST['street']) && isset($_POST['number'])  && 
            isset($_POST['town']) && isset($_POST['location_lat']) &&
            isset($_POST['location_lon'])) {

                $full_name = $_POST['full_name'];
                $phone = $_POST['phone'];
                $street = $_POST['street'];
                $number = $_POST['number'];
                $town = $_POST['town'];
                $location_lat = $_POST['location_lat'];
                $location_lon = $_POST['location_lon'];

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

                    $sql = "UPDATE users SET full_name = ?, phone = ?, street = ?, number = ?, town = ?, location_lat = ?, location_lon = ?, formCompleted = true WHERE id = ? ";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("sssisdds", $full_name, $phone, $street, $number, $town,$location_lat, $location_lon, $user_id);
                    $result = $stmt->execute();

                    if ($result) {
                        // Επιτυχής εισαγωγή
                        http_response_code(200);
                        $response = array("status" => "updated", "message" => "Η εισαγωγή των προσωπικών δεδομένων του πολίτη ήταν επιτυχής !");
                        
                    } else {
                        // Ανεπιτυχής εισαγωγή
                        http_response_code(500);
                        $response = array("status" => "server_error", "message" => "Η εισαγωγή απέτυχε. Παρακαλώ δοκιμάστε ξανά." . $conn->error);
                    }
        
                    // Κλείσιμο της προετοιμασμένης δήλωσης
                    $stmt->close();

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
    } else{

        http_response_code(401);
        $response = array("status" => "need_connection", "message" => 'Δεν υπήρχε σύνδεση χρήστη ή συνδεσή σας έληξε');
    }

        echo json_encode($response);
        $conn->close();
?>
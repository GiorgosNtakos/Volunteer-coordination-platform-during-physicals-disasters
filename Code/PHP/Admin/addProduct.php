<?php
// Προσθέστε το αρχείο σύνδεσης στη βάση δεδομένων
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

// Ελέγξτε αν το αίτημα είναι POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ( isset($_POST['item-name']) && isset($_POST['item_category'])){

        // Λήψη των δεδομένων από τη φόρμα
        $itemName = $_POST['item-name'];
        $categoryId = $_POST['item_category'];
        $details = json_decode($_POST['details'], true); // Λήψη και αποκωδικοποίηση των λεπτομερειών

        // Ελέγχουμε αν υπάρχει ήδη η κατηγορία στη βάση
        $stmt = $conn->prepare("SELECT name FROM items WHERE name = ?");
        $stmt->bind_param("s", $itemName);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            http_response_code(409);
            $response = array("status" => "exists", "message" => "Το αντικείμενο υπάρχει ήδη και δεν μπορεί να προστεθεί εκ νέου.");
        } else{

        // Μετατροπή των λεπτομερειών σε συμβολοσειρά για αποθήκευση
        $detailString = "";
        foreach ($details as $detail) {
            $detailString .= $detail['name'] . " : " . $detail['value'] . "\n";
        }

        // Προετοιμασία του SQL ερωτήματος
        $stmt = $conn->prepare("INSERT INTO Items (name, category_id, details) VALUES (?, ?, ?)");
        // Δέσιμο των παραμέτρων
        $stmt->bind_param("sis", $itemName, $categoryId, $detailString);

        // Εκτέλεση του ερωτήματος
        if ($stmt->execute()) {
            http_response_code(201);
            $response = array("status" => "created", "message" => "Το νέο είδος προστέθηκε επιτυχώς");
        } else {
            http_response_code(500);
            $response = array("status" => "server_error", "message" => "Σφάλμα κατά την εισαγωγή του είδους: " . $stmt->error);
        }

    }

        // Κλείσιμο της δήλωσης
        $stmt->close();
    }else{
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

// Κλείσιμο της σύνδεσης
$conn->close();
?>

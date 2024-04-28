<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

// Ελέγξτε αν το αίτημα είναι POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['task_id']) && isset($_POST['item']) && isset($_POST['quantity']) && isset($_POST['task_type']) && isset($_POST['username'])){

        // Λήψη των δεδομένων από τη φόρμα
        $task_id = $_POST['task_id'];
        $item = $_POST['item'];
        $quantity = $_POST['quantity'];
        $task_type = $_POST['task_type'];
        $username = $_POST['username']

        // Προετοιμασία του SQL ερωτήματος για εισαγωγή στον πίνακα Ανακοινώσεων
        $stmt = $conn->prepare("INSERT INTO Announcements (task_id, item, quantity, task_type, username) VALUES (?, ?, ?, ?, ?)");
        // Δέσιμο των παραμέτρων
        $stmt->bind_param("ssii", $task_id, $item, $quantity, $task_type, $username);

        // Εκτέλεση του ερωτήματος
        if ($stmt->execute()) {
            http_response_code(201);
            $response = array("status" => "created", "message" => "The announcement was successfuully added to the backend and database");
        } else {
            http_response_code(500);
            $response = array("status" => "server_error", "message" => "backend or database error during data insertion: " . $stmt->error);
        }

        // Κλείσιμο της δήλωσης
        $stmt->close();
    } else {
        // Αν λείπουν πεδία
        http_response_code(400);
        $response = array("status" => "missing_400", "message" => "missing post parameters.");
    }
} else {
    // Αν η αίτηση δεν είναι POST
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

echo json_encode($response);

// Κλείσιμο της σύνδεσης
$conn->close();
?>

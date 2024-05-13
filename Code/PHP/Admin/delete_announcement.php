<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: DELETE");
require '../Global/db_connect.php';
$conn->set_charset("utf8");

parse_str(file_get_contents("php://input"), $_DELETE);

if ($_SERVER["REQUEST_METHOD"] === 'DELETE') {
    if (isset($_DELETE['id'])) {
        
        $id = $_DELETE["id"];

        $sql = "SELECT id FROM Announcements WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Διαγραφή του προϊόντος
            $sql = "DELETE announcements, announcementitems FROM announcements 
            INNER JOIN announcementitems ON announcements.id = announcementitems.announcement_id 
            WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $id);
            if ($stmt->execute()) {                
                // Επιτυχής διαγραφή και ενημέρωση
                http_response_code(200);
                $response = array("status" => "success", "message" => "Η ανακοίνωση διαγράφηκε επιτυχώς.");
    
            } else {
                // Σφάλμα κατά τη διαγραφή της ανακοίνωσης
                http_response_code(500); // Επιστροφή κωδικού σφάλματος 500
                $response = array("status" => "server_error", "message" => "Σφάλμα κατά τη διαγραφή της ανακοίνωσης: " . $conn->error);
            }
        } else {
            // Η ανακοίνωση δε βρέθηκε
            http_response_code(404);
            $response = array("status" => "not_found_404", "message" => "Η ανακοίνωση δεν βρέθηκε.");
        }

    } else {
        // Μη έγκυρη ανακοίνωση
        http_response_code(400); // Επιστροφή κωδικού σφάλματος 400
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα DELETE.");
    }
} else {
    // Μη έγκυρη αίτηση
    http_response_code(405); // Επιστροφή κωδικού σφάλματος 400
   $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

echo json_encode($response);
$conn->close();
?>
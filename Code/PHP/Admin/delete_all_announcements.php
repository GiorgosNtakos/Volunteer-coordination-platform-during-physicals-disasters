<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: DELETE");
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === 'DELETE') {

    $sql_announcements = "DELETE FROM announcements";
    $stmt_announcements = $conn->prepare($sql_announcements);

    $sql_announcements_items = "DELETE FROM announcementitems";
    $stmt_announcements_items = $conn->prepare($sql_announcements_items);

    if($stmt_announcements->execute() && $stmt_announcements_items->execute())
    {
        http_response_code(200);
        $response = array("status" => "success", "message" => "Διαγράφηκαν όλες οι ανακοινώσεις με επιτυχία.");
        $stmt_announcements_items->close();
        $stmt_announcements->close();
        
    } else  {
        // Σφάλμα κατά την εισαγωγή
        http_response_code(500); // Επιστροφή κωδικού σφάλματος 500
        $response = array("status" => "server_500", "message" => "Σφάλμα κατά την διαγραφή: " . $conn->error);
         }

} else {
    // Μη έγκυρη αίτηση
    http_response_code(405); // Επιστροφή κωδικού σφάλματος 400
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.". $conn->error);

}

echo json_encode($response);
$conn->close();
?>

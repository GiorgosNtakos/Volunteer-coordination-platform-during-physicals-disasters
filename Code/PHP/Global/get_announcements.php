<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $sql = "SELECT announcements.id as announcement_id, items.name, announcementitems.quantity, announcements.created_at, announcements.updated_at
        FROM Announcements
        INNER JOIN announcementitems ON announcements.id = announcementitems.announcement_id
        INNER JOIN items ON announcementitems.item_id = items.id
        WHERE announcements.is_hidden = 0
        ORDER BY announcements.id, items.name";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $announcements = array();

        while($row = $result->fetch_assoc()) {
         $announcements[$row['announcement_id']]['announcement_id'] = $row['announcement_id'];
         $announcements[$row['announcement_id']]['created_at'] = $row['created_at'];
         $announcements[$row['announcement_id']]['updated_at'] = $row['updated_at'];
         $announcements[$row['announcement_id']]['items'][] = ['name' => $row['name'], 'quantity' => $row['quantity']];
        }

        http_response_code(200);
        $response = array("status" => "success", "message" => "Οι ανακοινώσεις ανακτήθηκαν επιτυχώς.", "announcements" => array_values($announcements));
      } else if($result->num_rows === 0){
        http_response_code(200);
        $response = array("status" => "success_but_empty", "message" => "Δεν υπάρχουν ενεργές ανακοινώσεις.");
      } else {
        http_response_code(500);
        $response = array("status" => "server_error" , "message" => "Σφάλμα κατά την ανάκτηση των διαθέσιμων ανακοινώσεων: " . $conn->error);
      }


} else {
    http_response_code(405);
    $response = array("status" => "wrong_method_405" , "message" => "Μη έγκυρη αίτηση.");
}

echo json_encode($response);
$conn->close();
?>

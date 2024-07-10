<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === "GET") {
  $sql = "SELECT * FROM Items";
  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
      $items = array();
      while ($row = $result->fetch_assoc()) {
          $items[] = $row;
      }

      http_response_code(200);
      $response = array("status" => "success", "message" =>"Τα είδη ανακτήθηκαν επιτιχώς", "items" => $items);

  } else if($result->num_rows === 0) {
      http_response_code(200);
      $response = array("status" => "success_but_empty" , "message" => "Δεν υπάρχουν διαθέσιμσ είδη." . $conn->error);
  } else{
      http_response_code(500);
      $response = array("status" => "server_error" , "message" => "Σφάλμα κατά την ανάκτηση των ειδών: " . $conn->error);
  }
} else {
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}echo json_encode($response);
$conn->close();


?>
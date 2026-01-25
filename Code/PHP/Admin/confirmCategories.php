<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

// Έλεγχος αν έχουν σταλεί δεδομένα
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    if(isset($_POST["activeCategories"]) || isset($_POST["inactiveCategories"])) {
      // Λήψη των επιλεγμένων κατηγοριών από το Ajax request
      

      if (!empty($_POST["inactiveCategories"])) {
        $inactiveCategories = $_POST["inactiveCategories"];
      foreach($inactiveCategories as $category_name) {
        $updateQuery = "UPDATE categories SET active = false WHERE category_name = ?";
        $stmt = $conn->prepare($updateQuery);
        $stmt->bind_param("s", $category_name);
        $stmt->execute();
        $stmt->close();
      }
    }

      // Ενημέρωση της βάσης δεδομένων για κάθε επιλεγμένη κατηγορία
      if (!empty($_POST["activeCategories"])) {
        $activeCategories = $_POST["activeCategories"];
      foreach ($activeCategories as $category_name) {
        // Προσθέστε κώδικα για να ενημερώσετε τη βάση δεδομένων
        // Παράδειγμα:
        $updateQuery = "UPDATE categories SET active = true WHERE category_name = ?";
        $stmt = $conn->prepare($updateQuery);
        $stmt->bind_param("s", $category_name );
        $stmt->execute();
        $stmt->close();
      }
    }

      http_response_code(200);
      $response = array("status" => "success", "message" => "Οι κατηγορίες επιβεβαιώθηκαν επιτυχώς!");

    } else {
        http_response_code(400);
        $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
    } 
}else {
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

// Επιστροφή απάντησης στον client (JavaScript)
echo json_encode($response);
$conn->close();
?>
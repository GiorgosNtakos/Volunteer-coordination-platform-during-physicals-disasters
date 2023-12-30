<?php 
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require 'db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === "POST") {

  $productName = isset($_POST["product_name"]) && $_POST["product_name"] !== '' ? mysqli_real_escape_string($conn, $_POST["product_name"]) : null;
  $category = isset($_POST["category"]) && $_POST["category"] !== '' ? mysqli_real_escape_string($conn, $_POST["category"]) : null;
  $subcategory = isset($_POST["subcategory"]) && $_POST["subcategory"] !== '' ? mysqli_real_escape_string($conn, $_POST["subcategory"]) : null;
  $price = isset($_POST["price"]) && $_POST["price"] !== '' ? mysqli_real_escape_string($conn, $_POST["price"]) : null;
 
  if ($productName && $category && $subcategory && $price) {

    $check_existing_product_sql = "SELECT product_id FROM products WHERE name = ?";
    $stmt = $conn->prepare($check_existing_product_sql);
    $stmt->bind_param("s", $productName);
    $stmt->execute();
    $check_existing_product_result = $stmt->get_result();


if ($check_existing_product_result !== FALSE && $check_existing_product_result->num_rows > 0) {
  // Το προϊόν υπάρχει ήδη στη βάση δεδομένων, δεν χρειάζεται επαναληπτική εισαγωγή
  http_response_code(409);
  $response = array("status" => "exists", "message" => "Το προϊόν υπάρχει ήδη και δεν μπορεί να προστεθεί εκ νέου.");
} else{

  // Κώδικας για την εισαγωγή του προϊόντος στη βάση δεδομένων
  $insert_sql = "INSERT INTO products (name, category_id, subcategory_id, price)
  VALUES (?, (SELECT category_id FROM categories WHERE name = ?), (SELECT subcategory_id FROM subcategories WHERE name = ?), ?)";

    $stmt = $conn->prepare($insert_sql);
    $stmt->bind_param("ssss", $productName, $category, $subcategory, $price);

    if ($stmt->execute()) {
      // Επιτυχής εισαγωγή
      http_response_code(201);
      $response = array("status" => "created", "message" => "Το προϊόν προστέθηκε επιτυχώς στη βάση δεδομένων.");
      
  } else  {
      // Σφάλμα κατά την εισαγωγή
      http_response_code(500); // Επιστροφή κωδικού σφάλματος 500
      $response = array("status" => "server_error", "message" => "Σφάλμα κατά την εισαγωγή του προϊόντος: " . $conn->error);
       }
      }
    } else {
      // Λείπουν παράμετροι από το αίτημα POST
      http_response_code(400); // Επιστροφή κωδικού σφάλματος 400
      $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
    }
} else {
    // Μη έγκυρη αίτηση
    http_response_code(405); // Επιστροφή κωδικού σφάλματος 400
    $response  = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.". $conn->error);

}

echo json_encode($response);
$conn->close();
?>
<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if(isset($_POST['categoriesList'])){
        $categoriesList = $_POST['categoriesList'];

        foreach ($categoriesList as $category) {
            $categoryId = $category['name']; // Υποθέτουμε ότι το 'name' είναι το ID της κατηγορίας
            $isActive = $category['value']; // Κατάσταση (ενεργή ή ανενεργή)

            $sql = "UPDATE Categories SET active = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ii", $isActive, $categoryId);
            $stmt->execute();
        }

        $response = array("status" => "success", "message" => "Η κατάσταση των κατηγοριών ενημερώθηκε επιτυχώς.");
    } else{
    http_response_code(400);
    $response = array("status" => "missing_400", "message" => "Λείπουν παράμετροι από το αίτημα POST.");
    }
} else {
    http_response_code(405);
    $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
}

echo json_encode($response);
$stmt->close();
$conn->close();
?>
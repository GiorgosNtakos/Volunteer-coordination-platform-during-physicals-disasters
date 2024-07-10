<?php
require_once(__DIR__.'/../Global/db_connect.php');

if (isset($_POST['lat']) && isset($_POST['lng'])) {
    $newLat = $_POST['lat'];
    $newLng = $_POST['lng'];

// Ενημέρωση της βάσης δεδομένων με τις νέες συντεταγμένες
$sql = "UPDATE Vehicles SET location_lat = $newLat, location_lon = $newLng WHERE name = 'Base' "; 

if (mysqli_query($conn, $sql)) {
    echo json_encode(array('status' => 'success', 'message' => 'Update request received successfully.'));
} else {
    echo json_encode(['status' => 'error', 'message' => 'Σφάλμα κατά την ενημέρωση των συντεταγμένων: ' . mysqli_error($conn)]);
}
}

mysqli_close($conn);

?>

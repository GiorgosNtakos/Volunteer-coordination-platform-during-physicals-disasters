<?php
/// Include  database connection code
require_once(__DIR__.'/../Global/db_connect.php');

// Λάβετε τις νέες συντεταγμένες από το AJAX αίτημα
if (isset($_POST['lat']) && isset($_POST['lng'])) {
    $newLat = $_POST['lat'];
    $newLng = $_POST['lng'];

// Εκτελέστε το SQL ερώτημα για ενημέρωση της βάσης δεδομένων με τις νέες συντεταγμένες
$sql = "UPDATE Vehicles SET location_lat = $newLat, location_lon = $newLng WHERE name = 'Base' "; 

if (mysqli_query($conn, $sql)) {

     // Εάν η ενημέρωση της βάσης ολοκληρωθεί με επιτυχία, ενημερώστε τις συντεταγμένες των οχημάτων
     //$sqlUpdateVehicles = "UPDATE Vehicles SET location_lat = ST_X(generate_random_location_within_radius(location_lat, location_lon, 5)), location_lon = ST_Y(generate_random_location_within_radius(location_lat, location_lon, 5)) WHERE vehicle_id != 48"; 
     //mysqli_query($conn, $sqlUpdateVehicles);


    echo json_encode(array('status' => 'success', 'message' => 'Update request received successfully.'));
} else {
    echo json_encode(['status' => 'error', 'message' => 'Σφάλμα κατά την ενημέρωση των συντεταγμένων: ' . mysqli_error($conn)]);
}
}

// Κλείστε τη σύνδεση με τη βάση δεδομένων
mysqli_close($conn);

?>

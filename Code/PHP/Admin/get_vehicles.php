<?php
// Include  database connection code
require_once(__DIR__.'/../Global/db_connect.php');

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
//header("Content-Type: application/json");




// Fetch vehicle, request, and offer data from the database
$sql = "
    SELECT vehicles.id, vehicles.name, vehicles.assigned_tasks, vehicles.number, vehicles.location_lat, vehicles.location_lon, vehicles.user_id
    FROM vehicles
   
";

$result = mysqli_query($conn, $sql);

if (!$result) {
    die('Error fetching data: ' . mysqli_error($conn));
}

// Store the data in an array
$data = array();
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode($data);

mysqli_close($conn);
?>

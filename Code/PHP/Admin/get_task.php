<?php
require_once(__DIR__.'/../Global/db_connect.php');

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
//header("Content-Type: application/json");




// Fetch vehicle, request, and offer data from the database
$sql = "SELECT Users.id, Users.full_name, Users.phone, Users.location_lat, Users.location_lon, Tasks.id AS task_id,
              Tasks.quantity, Tasks.type, Tasks.status, Tasks.created_at, Tasks.vehicle_id,
             vehicles.updated_at, vehicles.name

        FROM  Tasks
        INNER JOIN Users ON Tasks.user_id = Users.id
        INNER JOIN vehicles ON Tasks.vehicle_id = vehicles.id";
   

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

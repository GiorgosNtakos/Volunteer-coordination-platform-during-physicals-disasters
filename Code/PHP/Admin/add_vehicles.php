<?php
// Include your database connection code
require_once(__DIR__.'/../Global/db_connect.php');


// Base location (center)
$baseLat = 37.7749; // Example base latitude
$baseLon = -122.4194; // Example base longitude

// Function to generate random coordinates within a specified radius
function generateRandomCoords($baseLat, $baseLon, $radius) {
    $latChange = $radius / 111300; // 1 degree latitude change ≈ 111.3 km
    $lonChange = $radius / (111300 * cos(deg2rad($baseLat))); // 1 degree longitude change ≈ 111.3 km * cos(latitude)
    
    $randomLat = $baseLat + (mt_rand(-100000, 100000) * $latChange / 100000);
    $randomLon = $baseLon + (mt_rand(-100000, 100000) * $lonChange / 100000);
    
    return array('lat' => $randomLat, 'lon' => $randomLon);
}

for ($i = 1; $i <= 3; $i++) {
    $coords = generateRandomCoords($baseLat, $baseLon, 5000); // 5km radius

    $name = "Rescue Vehicle " . $i ; // Append timestamp to make names unique
    $location_lat = $coords['lat'];
    $location_lon = $coords['lon'];

    // Prepare and bind parameters
    $sql = "INSERT INTO Vehicles (name, location_lat, location_lon) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sdd", $name, $location_lat, $location_lon);

    // Execute the statement
    if ($stmt->execute() === TRUE) {
        echo "New record created successfully<br>";
    } else {
        echo "Error: " . $stmt->error; // Output the error from the prepared statement
    }

    $stmt->close();
}

$conn->close();
?>

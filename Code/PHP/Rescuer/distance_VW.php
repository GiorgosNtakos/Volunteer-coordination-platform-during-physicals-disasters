<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");
session_start();

if (isset($_SESSION['user_auth'])){

    $user_id = $_SESSION['user_auth']['id'];

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $vehicle_id_query = "SELECT vehicle_id FROM vehicles_assignments WHERE user_id = ?";
        $stmt = $conn->prepare($vehicle_id_query);
        $stmt->bind_param('s', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $vehicle_id = $row['vehicle_id'];

            $stmtVehicleLocation = $conn->prepare("SELECT location_lat, location_lon FROM vehicles WHERE id = ?");
            $stmtVehicleLocation->bind_param("s", $vehicle_id);
            $stmtVehicleLocation->execute();
            $resultVehicleLocation = $stmtVehicleLocation->get_result();
            $vehicleLocation = $resultVehicleLocation->fetch_assoc();
        
            // Ανάκτηση συντεταγμένων της αποθήκης (υποθέτοντας μία αποθήκη για απλότητα)
            $stmtWarehouseLocation = $conn->prepare("SELECT location_lat, location_lon FROM warehouse LIMIT 1");
            $stmtWarehouseLocation->execute();
            $resultWarehouseLocation = $stmtWarehouseLocation->get_result();
            $warehouseLocation = $resultWarehouseLocation->fetch_assoc();
        
            // Υπολογισμός απόστασης
            $distance = calculateDistance(
                $vehicleLocation['location_lat'], 
                $vehicleLocation['location_lon'], 
                $warehouseLocation['location_lat'], 
                $warehouseLocation['location_lon']
            );
        
            // Έλεγχος απόστασης και αντίστοιχες ενέργειες
            if ($distance <= 100) {
                $response = [
                    'status' => 'success',
                    'message' => 'Το όχημα είναι εντός της επιτρεπόμενης απόστασης για εκφόρτωση.',
                    'distance' => $distance // Ενσωμάτωση της απόστασης στο response
                ];
            } else {
                $response = [
                    'status' => 'too_far',
                    'message' => 'Το όχημα είναι εκτός της επιτρεπόμενης απόστασης.',
                    'distance' => $distance // Επίσης ενσωματώνουμε την απόσταση στο response
                ];
            }
        } else {
            http_response_code(404);
            $response = array("status" => "vehicle_not_found", "message" => "Δεν βρέθηκε όχημα για τον διασώστη.");
        }
    } else{
        http_response_code(405);
        $response = array("status" => "wrong_method_405", "message" => "Μη έγκυρη αίτηση.");
    }
} else{
    http_response_code(401);
    $response = array("status" => "need_connection", "message" => 'Δεν υπήρχε σύνδεση χρήστη ή συνδεσή σας έληξε');
}

function calculateDistance($lat1, $lon1, $lat2, $lon2) {
    $earthRadius = 6371000; // Ακτίνα της Γης σε μέτρα

    $latFrom = deg2rad($lat1);
    $lonFrom = deg2rad($lon1);
    $latTo = deg2rad($lat2);
    $lonTo = deg2rad($lon2);

    $latDelta = $latTo - $latFrom;
    $lonDelta = $lonTo - $lonFrom;

    $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
        cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
    return $angle * $earthRadius;
}

echo json_encode($response);
$stmt->close();
$conn->close();
?>
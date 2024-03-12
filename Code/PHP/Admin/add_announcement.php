<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
require '../Global/db_connect.php';
$conn->set_charset("utf8");

parse_str(file_get_contents("php://input"), $_DELETE);

if (isset($_GET['task_id'])) {
    $task_id = $_GET['task_id'];

    // Ερώτημα SQL για το Task
    $task_sql = "SELECT * FROM Tasks WHERE task_id = ?";
    if ($stmt = $conn->prepare($task_sql)) {
        $stmt->bind_param("i", $task_id);
        $stmt->execute();
        
        // Αποθήκευση αποτελεσμάτων Task
        $task_result = $stmt->get_result();
        $task_data = $task_result->fetch_assoc();
        $stmt->close();
    } else {
        echo json_encode(array('error' => 'Failed to prepare Task SQL statement'));
        exit();
    }

    // Ερώτημα SQL για το Username του δημιουργού του Task
    $username_sql = "SELECT Users.username
                     FROM Users
                     JOIN Users_Tasks ON Users.user_id = Users_Tasks.user_id
                     WHERE Users_Tasks.task_id = ?";
    if ($stmt = $conn->prepare($username_sql)) {
        $stmt->bind_param("i", $task_id);
        $stmt->execute();
        
        // Αποθήκευση αποτελεσμάτων Username
        $username_result = $stmt->get_result();
        $usernames = [];
        while ($row = $username_result->fetch_assoc()) {
            $usernames[] = $row['username'];
        }
        $stmt->close();
    } else {
        echo json_encode(array('error' => 'Failed to prepare Username SQL statement'));
        exit();
    }

    // Συγχώνευση δεδομένων σε ένα JSON αντικείμενο
    $response = array(
        'task_data' => $task_data,
        'usernames' => $usernames
    );

    // Επιστροφή δεδομένων ως JSON
    echo json_encode($response);
}
?>

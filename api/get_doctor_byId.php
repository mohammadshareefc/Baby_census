<?php
// Include the database connection
require 'db.php';

header('Content-Type: application/json');

// Get the doctor_id from the request
$doctor_id = isset($_GET['doctor_id']) ? $_GET['doctor_id'] : null;

if (!$doctor_id) {
    http_response_code(400); // Bad request
    echo json_encode(['error' => 'Doctor ID is required']);
    exit;
}

try {
    // Prepare the SQL statement to fetch doctor based on the doctor_id
    $sql = "SELECT * FROM doctor WHERE id = :doctor_id"; 
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':doctor_id', $doctor_id, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch the doctor record that matches the doctor_id
    $doctor = $stmt->fetch(PDO::FETCH_ASSOC);

    // Return the doctor as JSON
    if ($doctor) {
        echo json_encode($doctor);
    } else {
        echo json_encode(['message' => 'No doctor found for the specified ID']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not fetch doctor: ' . $e->getMessage()]);
}

$conn = null;
?>

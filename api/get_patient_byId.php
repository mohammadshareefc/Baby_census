<?php
// Include the database connection
require 'db.php';

header('Content-Type: application/json');

// Get the patient_id from the request
$patient_id = isset($_GET['patient_id']) ? $_GET['patient_id'] : null;

if (!$patient_id) {
    http_response_code(400); // Bad request
    echo json_encode(['error' => 'Patient ID is required']);
    exit;
}

try {
    // Prepare the SQL statement to fetch patient based on the patient_id
    $sql = "SELECT * FROM patient WHERE id = :patient_id"; 
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':patient_id', $patient_id, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch the patient record that matches the patient_id
    $patient = $stmt->fetch(PDO::FETCH_ASSOC);

    // Return the patient as JSON
    if ($patient) {
        echo json_encode($patient);
    } else {
        echo json_encode(['message' => 'No patient found for the specified ID']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not fetch patient: ' . $e->getMessage()]);
}

$conn = null;
?>

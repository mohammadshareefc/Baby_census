<?php
// Include the database connection
require 'db.php'; // Adjust the path as needed

header('Content-Type: application/json');

// Check if patient_id is provided in the query string
$patient_id = isset($_GET['patient_id']) ? (int)$_GET['patient_id'] : null;

if (!$patient_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Patient ID is required']);
    exit;
}

try {
    // Prepare the SQL statement to delete the patient
    $sql = "DELETE FROM patient WHERE id = :patient_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':patient_id', $patient_id, PDO::PARAM_INT);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Patient deleted successfully']);
    } else {
        throw new Exception('Could not delete patient');
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal server error
    echo json_encode(['success' => false, 'message' => 'Could not delete patient: ' . $e->getMessage()]);
}

// Close the database connection
$conn = null;
?>

<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Extract baby_id from the URL
$treatment_id = isset($_SERVER['PATH_INFO']) ? basename($_SERVER['PATH_INFO']) : null;

// Get the input data from the request
$input = json_decode(file_get_contents('php://input'), true);

// Retrieve the treatment data from the input
$name = isset($input['treatmentName']) ? $input['treatmentName'] : null;
$prescription = isset($input['prescription']) ? $input['prescription'] : null;
$patient_id = isset($input['patientId']) ? $input['patientId'] : null;
$hospital_id = isset($input['hospitalId']) ? $input['hospitalId'] : null;

// Check if treatment ID and required fields are provided
if (!$treatment_id || !$name || !$patient_id || !$hospital_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Treatment ID, name, patient ID, and hospital ID are required.']);
    exit;
}

try {
    // Validate and convert treatment_id, patient_id, and hospital_id to integers
    $treatment_id = (int)$treatment_id;
    $patient_id = (int)$patient_id;
    $hospital_id = (int)$hospital_id;

    // Prepare the SQL statement to update the treatment
    $sql = "UPDATE treatment
            SET name = :name, prescription = :prescription,
                patient_id = :patient_id, hospital_id = :hospital_id
            WHERE id = :treatment_id";
    $stmt = $conn->prepare($sql);
    
    // Bind parameters to the SQL query
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':prescription', $prescription);
    $stmt->bindParam(':patient_id', $patient_id, PDO::PARAM_INT); // Bind patient_id as an integer
    $stmt->bindParam(':hospital_id', $hospital_id, PDO::PARAM_INT); // Bind hospital_id as an integer
    $stmt->bindParam(':treatment_id', $treatment_id, PDO::PARAM_INT); // Bind treatment_id as an integer

    // Execute the statement
    $stmt->execute();

    // Return success response
    echo json_encode(['success' => true, 'message' => 'Treatment updated successfully.']);
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not update treatment: ' . $e->getMessage()]);
}

// Close the database connection
$conn = null;
?>

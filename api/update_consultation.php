<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Extract consultation_id from the URL
$consultation_id = isset($_SERVER['PATH_INFO']) ? basename($_SERVER['PATH_INFO']) : null;

// Get the input data from the request
$input = json_decode(file_get_contents('php://input'), true);

// Retrieve the consultation data from the input
$date = isset($input['consultationDate']) ? $input['consultationDate'] : null;
$patient_id = isset($input['patientId']) ? $input['patientId'] : null;
$doctor_id = isset($input['doctorId']) ? $input['doctorId'] : null;
$details = isset($input['consultationDetails']) ? $input['consultationDetails'] : null;
$report = isset($input['consultationReport']) ? $input['consultationReport'] : null;
$hospital_id = isset($input['hospitalId']) ? $input['hospitalId'] : null;

// Validate required fields
if (!$consultation_id || !$date || !$patient_id || !$doctor_id || !$details || !$report || !$hospital_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Consultation ID, date, patient ID, doctor ID, details, report, and hospital ID are required.']);
    exit;
}

try {
    // Validate and convert IDs to integers
    $consultation_id = (int)$consultation_id;
    $patient_id = (int)$patient_id;
    $doctor_id = (int)$doctor_id;
    $hospital_id = (int)$hospital_id;

    // Prepare the SQL statement to update the consultation
    $sql = "UPDATE consultation
            SET date = :date, patient_id = :patient_id,
                details = :details, report = :report,
                doctor_id = :doctor_id, hospital_id = :hospital_id
            WHERE id = :consultation_id";
    $stmt = $conn->prepare($sql);
    
    // Bind parameters to the SQL query
    $stmt->bindParam(':date', $date);
    $stmt->bindParam(':patient_id', $patient_id, PDO::PARAM_INT);
    $stmt->bindParam(':details', $details);
    $stmt->bindParam(':report', $report);
    $stmt->bindParam(':doctor_id', $doctor_id, PDO::PARAM_INT);
    $stmt->bindParam(':hospital_id', $hospital_id, PDO::PARAM_INT);
    $stmt->bindParam(':consultation_id', $consultation_id, PDO::PARAM_INT); // Bind consultation_id as an integer

    // Execute the statement
    $stmt->execute();

    // Return success response
    echo json_encode(['success' => true, 'message' => 'Consultation updated successfully.']);
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not update consultation: ' . $e->getMessage()]);
}

// Close the database connection
$conn = null;
?>

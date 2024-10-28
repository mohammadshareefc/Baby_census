<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Extract patient_id from the URL
$patient_id = isset($_SERVER['PATH_INFO']) ? basename($_SERVER['PATH_INFO']) : null;

// Get the input data from the request
$input = json_decode(file_get_contents('php://input'), true);

// Retrieve the other patient data from the input
$name = isset($input['patientName']) ? $input['patientName'] : null;
$contact = isset($input['patientContact']) ? $input['patientContact'] : null;
$aadhaar = isset($input['patientAadhaar']) ? $input['patientAadhaar'] : null;
$bloodgroup = isset($input['patientBloodGroup']) ? $input['patientBloodGroup'] : null;
$husband = isset($input['patientHusband']) ? $input['patientHusband'] : null;
$doctor_id = isset($input['doctorId']) ? $input['doctorId'] : null;
$hospital_id = isset($input['hospitalId']) ? $input['hospitalId'] : null;

// Check if patient ID and other required fields are provided
if (!$patient_id || !$name || !$hospital_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Patient ID, name, and hospital ID are required.']);
    exit;
}

try {
    // Validate and convert patient_id, hospital_id, and doctor_id to integers
    $patient_id = (int)$patient_id;
    $hospital_id = (int)$hospital_id;
    $doctor_id = !empty($doctor_id) ? (int)$doctor_id : null; // Allow doctor_id to be null if not provided

    // Prepare the SQL statement to update the patient
    $sql = "UPDATE patient
            SET name = :name, contact = :contact, aadhaar = :aadhaar, bloodgroup = :bloodgroup,
                husband = :husband, doctor_id = :doctor_id, hospital_id = :hospital_id
            WHERE id = :patient_id";
    $stmt = $conn->prepare($sql);
    
    // Bind parameters to the SQL query
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':contact', $contact);
    $stmt->bindParam(':aadhaar', $aadhaar);
    $stmt->bindParam(':bloodgroup', $bloodgroup);
    $stmt->bindParam(':husband', $husband);
    $stmt->bindParam(':doctor_id', $doctor_id, PDO::PARAM_INT); // doctor_id can be NULL
    $stmt->bindParam(':hospital_id', $hospital_id, PDO::PARAM_INT);
    $stmt->bindParam(':patient_id', $patient_id, PDO::PARAM_INT); // Bind patient_id as an integer

    // Execute the statement
    $stmt->execute();

    // Return success response
    echo json_encode(['success' => true, 'message' => 'Patient updated successfully.']);
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not update patient: ' . $e->getMessage()]);
}

// Close the database connection
$conn = null;
?>

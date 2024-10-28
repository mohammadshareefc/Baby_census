<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Retrieve the patient data from the POST request
$name = isset($_POST['patientName']) ? $_POST['patientName'] : null;
$contact = isset($_POST['patientContact']) ? $_POST['patientContact'] : null;
$aadhaar = isset($_POST['patientAadhaar']) ? $_POST['patientAadhaar'] : null;
$bloodgroup = isset($_POST['patientBloodGroup']) ? $_POST['patientBloodGroup'] : null;
$husband = isset($_POST['patientHusband']) ? $_POST['patientHusband'] : null;
$doctor_id = isset($_POST['doctorId']) ? $_POST['doctorId'] : null;
$hospital_id = isset($_POST['hospitalId']) ? $_POST['hospitalId'] : null;

if (!$name || !$hospital_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Patient name and hospital ID are required.']);
    exit;
}

try {
    // Validate and convert hospital_id and doctor_id to integers
    $hospital_id = (int)$hospital_id;
    $doctor_id = !empty($doctor_id) ? (int)$doctor_id : null; // Allow doctor_id to be null if not provided

    // Prepare the SQL statement to insert a new patient
    $sql = "INSERT INTO patient (name, contact, aadhaar, bloodgroup, husband, doctor_id, hospital_id)
            VALUES (:name, :contact, :aadhaar, :bloodgroup, :husband, :doctor_id, :hospital_id)";
    $stmt = $conn->prepare($sql);
    
    // Bind parameters to the SQL query
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':contact', $contact);
    $stmt->bindParam(':aadhaar', $aadhaar);
    $stmt->bindParam(':bloodgroup', $bloodgroup);
    $stmt->bindParam(':husband', $husband);
    $stmt->bindParam(':doctor_id', $doctor_id, PDO::PARAM_INT); // doctor_id can be NULL
    $stmt->bindParam(':hospital_id', $hospital_id, PDO::PARAM_INT); // Bind hospital_id as an integer

    // Execute the statement
    $stmt->execute();

    // Return success response
    echo json_encode(['success' => true, 'message' => 'Patient created successfully.']);
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not create patient: ' . $e->getMessage()]);
}

// Close the database connection (optional, PDO closes it automatically at the end of the script)
$conn = null;
?>

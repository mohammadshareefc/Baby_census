<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Retrieve the consultation data from the POST request
$date = isset($_POST['consultationDate']) ? $_POST['consultationDate'] : null;
$patient_id = isset($_POST['patientId']) ? $_POST['patientId'] : null;
$doctor_id = isset($_POST['doctorId']) ? $_POST['doctorId'] : null;
$details = isset($_POST['consultationDetails']) ? $_POST['consultationDetails'] : null;
$report = isset($_POST['consultationReport']) ? $_POST['consultationReport'] : null;
$hospital_id = isset($_POST['hospitalId']) ? $_POST['hospitalId'] : null; // Retrieve from POST

// Validate required fields
if (!$date || !$patient_id || !$doctor_id || !$details || !$report || !$hospital_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Date, patient ID, doctor ID, details, report, and hospital ID are required.']);
    exit;
}

try {
    // Validate and convert IDs to integers
    $patient_id = (int)$patient_id;
    $doctor_id = (int)$doctor_id;
    $hospital_id = (int)$hospital_id;

    // Prepare the SQL statement to insert a new consultation
    $sql = "INSERT INTO consultation (date, patient_id, details, report, doctor_id, hospital_id)
            VALUES (:date, :patient_id, :details, :report, :doctor_id, :hospital_id)";
    $stmt = $conn->prepare($sql);
    
    // Bind parameters to the SQL query
    $stmt->bindParam(':date', $date);
    $stmt->bindParam(':patient_id', $patient_id, PDO::PARAM_INT);
    $stmt->bindParam(':details', $details);
    $stmt->bindParam(':report', $report);
    $stmt->bindParam(':doctor_id', $doctor_id, PDO::PARAM_INT);
    $stmt->bindParam(':hospital_id', $hospital_id, PDO::PARAM_INT);

    // Execute the statement
    $stmt->execute();

    // Return success response
    echo json_encode(['success' => true, 'message' => 'Consultation created successfully.']);
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not create consultation: ' . $e->getMessage()]);
}

// Close the database connection (optional, PDO closes it automatically at the end of the script)
$conn = null;
?>

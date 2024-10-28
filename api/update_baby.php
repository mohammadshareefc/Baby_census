<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Extract baby_id from the URL
$baby_id = isset($_SERVER['PATH_INFO']) ? basename($_SERVER['PATH_INFO']) : null;

// Get the input data from the request
$input = json_decode(file_get_contents('php://input'), true);

// Retrieve the baby data from the input
$gender = isset($input['babyGender']) ? $input['babyGender'] : null;
$dob = isset($input['babyDob']) ? $input['babyDob'] : null;
$weight = isset($input['babyWeight']) ? $input['babyWeight'] : null;
$health_status = isset($input['babyHealthStatus']) ? $input['babyHealthStatus'] : null;
$patient_id = isset($input['patientId']) ? $input['patientId'] : null;
$hospital_id = isset($input['hospitalId']) ? $input['hospitalId'] : null;

// Check if baby ID and required fields are provided
if (!$baby_id || !$gender || !$dob || !$patient_id || !$hospital_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Baby ID, gender, date of birth, patient ID, and hospital ID are required.']);
    exit;
}

try {
    // Validate and convert baby_id, patient_id, and hospital_id to integers
    $baby_id = (int)$baby_id;
    $patient_id = (int)$patient_id;
    $hospital_id = (int)$hospital_id;

    // Prepare the SQL statement to update the baby
    $sql = "UPDATE baby
            SET gender = :gender, dob = :dob, weight = :weight, health_status = :health_status,
                patient_id = :patient_id, hospital_id = :hospital_id
            WHERE id = :baby_id";
    $stmt = $conn->prepare($sql);
    
    // Bind parameters to the SQL query
    $stmt->bindParam(':gender', $gender);
    $stmt->bindParam(':dob', $dob);
    $stmt->bindParam(':weight', $weight);
    $stmt->bindParam(':health_status', $health_status);
    $stmt->bindParam(':patient_id', $patient_id, PDO::PARAM_INT); // Bind patient_id as an integer
    $stmt->bindParam(':hospital_id', $hospital_id, PDO::PARAM_INT); // Bind hospital_id as an integer
    $stmt->bindParam(':baby_id', $baby_id, PDO::PARAM_INT); // Bind baby_id as an integer

    // Execute the statement
    $stmt->execute();

    // Return success response
    echo json_encode(['success' => true, 'message' => 'Baby updated successfully.']);
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not update baby: ' . $e->getMessage()]);
}

// Close the database connection
$conn = null;
?>

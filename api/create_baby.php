<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Retrieve the baby data from the POST request
$gender = isset($_POST['babyGender']) ? $_POST['babyGender'] : null;
$dob = isset($_POST['babyDob']) ? $_POST['babyDob'] : null;
$weight = isset($_POST['babyWeight']) ? $_POST['babyWeight'] : null;
$health_status = isset($_POST['babyHealthStatus']) ? $_POST['babyHealthStatus'] : null;
$patient_id = isset($_POST['patientId']) ? $_POST['patientId'] : null;
$hospital_id = isset($_POST['hospitalId']) ? $_POST['hospitalId'] : null;

// Validate required fields
if (!$gender || !$dob || !$patient_id || !$hospital_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Gender, date of birth, patient ID, and hospital ID are required.']);
    exit;
}

try {
    // Validate and convert patient_id and hospital_id to integers
    $patient_id = (int)$patient_id;
    $hospital_id = (int)$hospital_id;

    // Prepare the SQL statement to insert a new baby
    $sql = "INSERT INTO baby (gender, dob, weight, health_status, patient_id, hospital_id)
            VALUES (:gender, :dob, :weight, :health_status, :patient_id, :hospital_id)";
    $stmt = $conn->prepare($sql);
    
    // Bind parameters to the SQL query
    $stmt->bindParam(':gender', $gender);
    $stmt->bindParam(':dob', $dob);
    $stmt->bindParam(':weight', $weight);
    $stmt->bindParam(':health_status', $health_status);
    $stmt->bindParam(':patient_id', $patient_id, PDO::PARAM_INT); // Bind patient_id as an integer
    $stmt->bindParam(':hospital_id', $hospital_id, PDO::PARAM_INT); // Bind hospital_id as an integer

    // Execute the statement
    $stmt->execute();

    // Return success response
    echo json_encode(['success' => true, 'message' => 'Baby created successfully.']);
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not create baby: ' . $e->getMessage()]);
}

// Close the database connection (optional, PDO closes it automatically at the end of the script)
$conn = null;
?>

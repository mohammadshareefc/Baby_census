<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Retrieve the bill data from the POST request
$amount = isset($_POST['billAmount']) ? $_POST['billAmount'] : null; // Adjusted to match form input name
$details = isset($_POST['billDetails']) ? $_POST['billDetails'] : null; // Adjusted to match form input name
$patient_id = isset($_POST['patientId']) ? $_POST['patientId'] : null;
$hospital_id = isset($_POST['hospitalId']) ? $_POST['hospitalId'] : null; // No need for "hidden" check since it's retrieved from POST

// Validate required fields
if (!$amount || !$details || !$patient_id || !$hospital_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Amount, details, patient ID, and hospital ID are required.']);
    exit;
}

try {
    // Validate and convert patient_id and hospital_id to integers
    $patient_id = (int)$patient_id;
    $hospital_id = (int)$hospital_id;

    // Prepare the SQL statement to insert a new bill
    $sql = "INSERT INTO bill (amount, details, patient_id, hospital_id)
            VALUES (:amount, :details, :patient_id, :hospital_id)";
    $stmt = $conn->prepare($sql);
    
    // Bind parameters to the SQL query
    $stmt->bindParam(':amount', $amount);
    $stmt->bindParam(':details', $details);
    $stmt->bindParam(':patient_id', $patient_id, PDO::PARAM_INT); // Bind patient_id as an integer
    $stmt->bindParam(':hospital_id', $hospital_id, PDO::PARAM_INT); // Bind hospital_id as an integer

    // Execute the statement
    $stmt->execute();

    // Return success response
    echo json_encode(['success' => true, 'message' => 'Bill created successfully.']);
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not create bill: ' . $e->getMessage()]);
}

// Close the database connection (optional, PDO closes it automatically at the end of the script)
$conn = null;
?>

<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Extract bill_id from the URL
$bill_id = isset($_SERVER['PATH_INFO']) ? basename($_SERVER['PATH_INFO']) : null;

// Get the input data from the request
$input = json_decode(file_get_contents('php://input'), true);

// Retrieve the bill data from the input
$amount = isset($input['billAmount']) ? $input['billAmount'] : null; // Adjusted to match form input name
$details = isset($input['billDetails']) ? $input['billDetails'] : null; // Adjusted to match form input name
$patient_id = isset($input['patientId']) ? $input['patientId'] : null;
$hospital_id = isset($input['hospitalId']) ? $input['hospitalId'] : null;

// Check if bill ID and required fields are provided
if (!$bill_id || !$amount || !$details || !$patient_id || !$hospital_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Bill ID, amount, details, patient ID, and hospital ID are required.']);
    exit;
}

try {
    // Validate and convert bill_id, patient_id, and hospital_id to integers
    $bill_id = (int)$bill_id;
    $patient_id = (int)$patient_id;
    $hospital_id = (int)$hospital_id;

    // Prepare the SQL statement to update the bill
    $sql = "UPDATE bill
            SET amount = :amount, details = :details,
                patient_id = :patient_id, hospital_id = :hospital_id
            WHERE id = :bill_id";
    $stmt = $conn->prepare($sql);
    
    // Bind parameters to the SQL query
    $stmt->bindParam(':amount', $amount);
    $stmt->bindParam(':details', $details);
    $stmt->bindParam(':patient_id', $patient_id, PDO::PARAM_INT); // Bind patient_id as an integer
    $stmt->bindParam(':hospital_id', $hospital_id, PDO::PARAM_INT); // Bind hospital_id as an integer
    $stmt->bindParam(':bill_id', $bill_id, PDO::PARAM_INT); // Bind bill_id as an integer

    // Execute the statement
    $stmt->execute();

    // Return success response
    echo json_encode(['success' => true, 'message' => 'Bill updated successfully.']);
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not update bill: ' . $e->getMessage()]);
}

// Close the database connection
$conn = null;
?>

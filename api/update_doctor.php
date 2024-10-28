<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Extract doctor_id from the URL
$doctor_id = isset($_SERVER['PATH_INFO']) ? basename($_SERVER['PATH_INFO']) : null;

// Get the input data from the request
$input = json_decode(file_get_contents('php://input'), true);

// Retrieve the other doctor data from the input
$name = isset($input['doctorName']) ? $input['doctorName'] : null;
$specialization = isset($input['doctorSpecialization']) ? $input['doctorSpecialization'] : null;
$contact = isset($input['doctorContact']) ? $input['doctorContact'] : null;
$hospital_id = isset($input['hospitalId']) ? $input['hospitalId'] : null;

// Check if doctor ID and other required fields are provided
if (!$doctor_id || !$name || !$hospital_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Doctor ID, name, and hospital ID are required.']);
    exit;
}

try {
    // Validate and convert doctor_id and hospital_id to integers
    $doctor_id = (int)$doctor_id;
    $hospital_id = (int)$hospital_id;

    // Prepare the SQL statement to update the doctor
    $sql = "UPDATE doctor
            SET name = :name, specialization = :specialization, contact = :contact, hospital_id = :hospital_id
            WHERE id = :doctor_id";
    $stmt = $conn->prepare($sql);
    
    // Bind parameters to the SQL query
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':specialization', $specialization);
    $stmt->bindParam(':contact', $contact);
    $stmt->bindParam(':hospital_id', $hospital_id, PDO::PARAM_INT);
    $stmt->bindParam(':doctor_id', $doctor_id, PDO::PARAM_INT); // Bind doctor_id as an integer

    // Execute the statement
    $stmt->execute();

    // Return success response
    echo json_encode(['success' => true, 'message' => 'Doctor updated successfully.']);
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not update doctor: ' . $e->getMessage()]);
}

// Close the database connection
$conn = null;
?>

<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Extract vaccine_id from the URL
$vaccine_id = isset($_SERVER['PATH_INFO']) ? basename($_SERVER['PATH_INFO']) : null;

// Get the input data from the request
$input = json_decode(file_get_contents('php://input'), true);

// Retrieve the vaccine data from the input
$name = isset($input['vaccineName']) ? $input['vaccineName'] : null;
$date_of_vaccination = isset($input['vaccinationDate']) ? $input['vaccinationDate'] : null;
$baby_id = isset($input['babyId']) ? $input['babyId'] : null;
$hospital_id = isset($input['hospitalId']) ? $input['hospitalId'] : null;

// Check if vaccine ID and required fields are provided
if (!$vaccine_id || !$name || !$date_of_vaccination || !$baby_id || !$hospital_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Vaccine ID, name, date of vaccination, baby ID, and hospital ID are required.']);
    exit;
}

try {
    // Validate and convert vaccine_id, baby_id, and hospital_id to integers
    $vaccine_id = (int)$vaccine_id;
    $baby_id = (int)$baby_id;
    $hospital_id = (int)$hospital_id;

    // Prepare the SQL statement to update the vaccine
    $sql = "UPDATE vaccine
            SET name = :name, date_of_vaccination = :date_of_vaccination,
                baby_id = :baby_id, hospital_id = :hospital_id
            WHERE id = :vaccine_id";
    $stmt = $conn->prepare($sql);
    
    // Bind parameters to the SQL query
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':date_of_vaccination', $date_of_vaccination);
    $stmt->bindParam(':baby_id', $baby_id, PDO::PARAM_INT); // Bind baby_id as an integer
    $stmt->bindParam(':hospital_id', $hospital_id, PDO::PARAM_INT); // Bind hospital_id as an integer
    $stmt->bindParam(':vaccine_id', $vaccine_id, PDO::PARAM_INT); // Bind vaccine_id as an integer

    // Execute the statement
    $stmt->execute();

    // Return success response
    echo json_encode(['success' => true, 'message' => 'Vaccine updated successfully.']);
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not update vaccine: ' . $e->getMessage()]);
}

// Close the database connection
$conn = null;
?>

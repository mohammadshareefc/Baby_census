<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Retrieve the vaccine data from the POST request
$name = isset($_POST['vaccineName']) ? $_POST['vaccineName'] : null;
$date_of_vaccination = isset($_POST['vaccinationDate']) ? $_POST['vaccinationDate'] : null;
$baby_id = isset($_POST['babyId']) ? $_POST['babyId'] : null;
$hospital_id = isset($_POST['hospitalId']) ? $_POST['hospitalId'] : null;

// Validate required fields
if (!$name || !$date_of_vaccination || !$baby_id || !$hospital_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Vaccine name, date of vaccination, baby ID, and hospital ID are required.']);
    exit;
}

try {
    // Validate and convert baby_id and hospital_id to integers
    $baby_id = (int)$baby_id;
    $hospital_id = (int)$hospital_id;

    // Prepare the SQL statement to insert a new vaccine
    $sql = "INSERT INTO vaccine (name, date_of_vaccination, baby_id, hospital_id)
            VALUES (:name, :date_of_vaccination, :baby_id, :hospital_id)";
    $stmt = $conn->prepare($sql);
    
    // Bind parameters to the SQL query
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':date_of_vaccination', $date_of_vaccination);
    $stmt->bindParam(':baby_id', $baby_id, PDO::PARAM_INT); // Bind baby_id as an integer
    $stmt->bindParam(':hospital_id', $hospital_id, PDO::PARAM_INT); // Bind hospital_id as an integer

    // Execute the statement
    $stmt->execute();

    // Return success response
    echo json_encode(['success' => true, 'message' => 'Vaccine created successfully.']);
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not create vaccine: ' . $e->getMessage()]);
}

// Close the database connection (optional, PDO closes it automatically at the end of the script)
$conn = null;
?>

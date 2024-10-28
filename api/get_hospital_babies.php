<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Get the hospital_id from the request (e.g., query parameters)
$hospital_id = isset($_GET['hospitalId']) ? $_GET['hospitalId'] : null;

if (!$hospital_id) {
    http_response_code(400); // Bad request
    echo json_encode(['error' => 'Hospital ID is required']);
    exit;
}

try {
    // Check if hospital_id is a valid number (since it is a BIGINT in your database)
    if (!is_numeric($hospital_id)) {
        http_response_code(400); // Bad request
        echo json_encode(['error' => 'Invalid Hospital ID']);
        exit;
    }

    // Convert hospital_id to an integer explicitly
    $hospital_id = (int)$hospital_id;

    // Modify the SQL to join the baby table with the patient table to get patient name
    $sql = "
        SELECT 
            baby.id, 
            baby.gender, 
            baby.dob, 
            baby.weight, 
            baby.health_status, 
            baby.patient_id, 
            patient.name AS patient_name 
        FROM 
            baby 
        JOIN 
            patient ON baby.patient_id = patient.id 
        WHERE 
            baby.hospital_id = :hospitalId
    ";
    
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':hospitalId', $hospital_id, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch all baby records along with patient names
    $babies = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the babies as JSON
    if ($babies) {
        echo json_encode($babies);
    } else {
        echo json_encode(['message' => 'No babies found for the specified hospital']);
    }
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['error' => 'Could not fetch babies: ' . $e->getMessage()]);
}

// Close the database connection (optional, PDO closes it automatically at the end of the script)
$conn = null;
?>

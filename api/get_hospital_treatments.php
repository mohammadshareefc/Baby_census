<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Get the hospital_id from the request (e.g., query parameters or POST body)
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

    // Prepare the SQL statement to fetch treatments based on the hospital_id
    $sql = "
        SELECT t.*, p.name AS patient_name 
        FROM treatment t 
        JOIN patient p ON t.patient_id = p.id 
        WHERE t.hospital_id = :hospitalId
    "; 
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':hospitalId', $hospital_id, PDO::PARAM_INT); // Bind hospital_id parameter as an integer
    $stmt->execute();

    // Fetch all treatment records that match the hospital_id
    $treatments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the treatments as JSON
    if ($treatments) {
        echo json_encode($treatments);
    } else {
        echo json_encode(['message' => 'No treatments found for the specified hospital']);
    }
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['error' => 'Could not fetch treatments: ' . $e->getMessage()]);
}

// Close the database connection (optional, PDO closes it automatically at the end of the script)
$conn = null;

?>

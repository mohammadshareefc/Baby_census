<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Get the hospital_id from the request (e.g., query parameters)
$hospital_id = isset($_GET['hospitalId']) ? $_GET['hospitalId'] : null;

// Check if the hospital_id is provided
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

    // Prepare the SQL statement to fetch patients along with doctor names
    $sql = "
        SELECT 
            patient.id, 
            patient.name, 
            patient.contact, 
            patient.aadhaar, 
            patient.bloodgroup, 
            patient.husband, 
            doctor.name as doctor_name
        FROM 
            patient
        LEFT JOIN 
            doctor ON patient.doctor_id = doctor.id
        WHERE 
            patient.hospital_id = :hospitalId"; 
    
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':hospitalId', $hospital_id, PDO::PARAM_INT); // Bind hospital_id parameter as an integer
    $stmt->execute();

    // Fetch all patient records that match the hospital_id
    $patients = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the patients as JSON
    if ($patients) {
        echo json_encode($patients);
    } else {
        echo json_encode(['message' => 'No patients found for the specified hospital']);
    }
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['error' => 'Could not fetch patients: ' . $e->getMessage()]);
}

// Close the database connection (optional, PDO closes it automatically at the end of the script)
$conn = null;
?>

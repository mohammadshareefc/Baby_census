<?php
// Include the database connection
require 'db.php'; // Adjust the path to your actual db.php file

header('Content-Type: application/json');

// Get the hospital ID from the request (e.g., query parameters)
$hospital_id = isset($_GET['hospitalId']) ? $_GET['hospitalId'] : null;

if (!$hospital_id) {
    // If no hospital ID is provided, return a 400 error
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Hospital ID is required']);
    exit;
}

try {
    // Check if the provided hospital ID is a valid number
    if (!is_numeric($hospital_id)) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'Invalid Hospital ID']);
        exit;
    }

    // Convert hospital ID to an integer
    $hospital_id = (int)$hospital_id;

    // Prepare SQL query to fetch the hospital by ID
    $sql = "SELECT * FROM hospital WHERE id = :hospitalId";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':hospitalId', $hospital_id, PDO::PARAM_INT); // Bind the hospital ID as an integer

    // Execute the query
    $stmt->execute();

    // Fetch the hospital record
    $hospital = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if a hospital record was found
    if ($hospital) {
        // Return the hospital record as JSON
        echo json_encode(['success' => true, 'data' => $hospital]);
    } else {
        // Return a 404 error if the hospital is not found
        http_response_code(404); // Not Found
        echo json_encode(['success' => false, 'message' => 'Hospital not found']);
    }
} catch (PDOException $e) {
    // Handle any database errors
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

// Close the database connection (optional)
$conn = null;
?>

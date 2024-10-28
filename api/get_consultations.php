<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

try {
    // Prepare the SQL statement
    $sql = "SELECT * FROM consultation"; // Adjust this to your actual consultation table name
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    // Fetch all consultation records
    $consultations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the consultations as JSON
    echo json_encode($consultations);
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['error' => 'Could not fetch consultations: ' . $e->getMessage()]);
}

// Close the database connection (optional, PDO closes it automatically at the end of the script)
$conn = null;
?>

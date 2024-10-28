<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

try {
    // Prepare the SQL statement
    $sql = "SELECT b.*, p.name AS patient_name FROM baby b JOIN patient p ON b.patient_id = p.id"; // Adjust this to your actual babies table name
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    // Fetch all baby records
    $babies = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the babies as JSON
    echo json_encode($babies);
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['error' => 'Could not fetch babies: ' . $e->getMessage()]);
}

// Close the database connection (optional, PDO closes it automatically at the end of the script)
$conn = null;
?>

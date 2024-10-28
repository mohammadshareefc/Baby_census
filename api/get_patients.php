<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

try {
    // Prepare the SQL statement
    $sql = "SELECT * FROM patient"; // Adjust this to your actual patients table name
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    // Fetch all patient records
    $patients = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the patients as JSON
    echo json_encode($patients);
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['error' => 'Could not fetch patients: ' . $e->getMessage()]);
}

// Close the database connection (optional, PDO closes it automatically at the end of the script)
$conn = null;
?>

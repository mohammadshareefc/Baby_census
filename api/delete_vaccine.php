<?php
// Include the database connection
require 'db.php'; // Adjust the path to your database connection file

header('Content-Type: application/json');

// Check if vaccine_id is provided in the query string
$vaccine_id = isset($_GET['vaccine_id']) ? (int)$_GET['vaccine_id'] : null;

if (!$vaccine_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Vaccine ID is required']);
    exit;
}

try {
    // Prepare the SQL statement to delete the vaccine record
    $sql = "DELETE FROM vaccine WHERE id = :vaccine_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':vaccine_id', $vaccine_id, PDO::PARAM_INT);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Vaccine record deleted successfully']);
    } else {
        throw new Exception('Could not delete vaccine record');
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal server error
    echo json_encode(['success' => false, 'message' => 'Could not delete vaccine record: ' . $e->getMessage()]);
}

// Close the database connection
$conn = null;
?>

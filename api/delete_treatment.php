<?php
// Include the database connection
require 'db.php'; // Adjust the path to your database connection file

header('Content-Type: application/json');

// Check if treatment_id is provided in the query string
$treatment_id = isset($_GET['treatment_id']) ? (int)$_GET['treatment_id'] : null;

if (!$treatment_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Treatment ID is required']);
    exit;
}

try {
    // Prepare the SQL statement to delete the treatment record
    $sql = "DELETE FROM treatment WHERE id = :treatment_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':treatment_id', $treatment_id, PDO::PARAM_INT);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Treatment record deleted successfully']);
    } else {
        throw new Exception('Could not delete treatment record');
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal server error
    echo json_encode(['success' => false, 'message' => 'Could not delete treatment record: ' . $e->getMessage()]);
}

// Close the database connection
$conn = null;
?>

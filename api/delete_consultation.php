<?php
// Include the database connection
require 'db.php'; // Adjust the path to your database connection file

header('Content-Type: application/json');

// Check if consultation_id is provided in the query string
$consultation_id = isset($_GET['consultation_id']) ? (int)$_GET['consultation_id'] : null;

if (!$consultation_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Consultation ID is required']);
    exit;
}

try {
    // Prepare the SQL statement to delete the consultation record
    $sql = "DELETE FROM consultation WHERE id = :consultation_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':consultation_id', $consultation_id, PDO::PARAM_INT);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Consultation record deleted successfully']);
    } else {
        throw new Exception('Could not delete consultation record');
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal server error
    echo json_encode(['success' => false, 'message' => 'Could not delete consultation record: ' . $e->getMessage()]);
}

// Close the database connection
$conn = null;
?>

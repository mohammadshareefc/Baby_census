<?php
// Include the database connection
require 'db.php'; // Adjust the path to your database connection file

header('Content-Type: application/json');

// Check if baby_id is provided in the query string
$baby_id = isset($_GET['baby_id']) ? (int)$_GET['baby_id'] : null;

if (!$baby_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Baby ID is required']);
    exit;
}

try {
    // Prepare the SQL statement to delete the baby record
    $sql = "DELETE FROM baby WHERE id = :baby_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':baby_id', $baby_id, PDO::PARAM_INT);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Baby record deleted successfully']);
    } else {
        throw new Exception('Could not delete baby record');
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal server error
    echo json_encode(['success' => false, 'message' => 'Could not delete baby record: ' . $e->getMessage()]);
}

// Close the database connection
$conn = null;
?>

<?php
// Include the database connection
require 'db.php'; // Adjust the path as needed

header('Content-Type: application/json');

// Check if bill_id is provided in the query string
$bill_id = isset($_GET['bill_id']) ? (int)$_GET['bill_id'] : null;

if (!$bill_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Bill ID is required']);
    exit;
}

try {
    // Prepare the SQL statement to delete the bill
    $sql = "DELETE FROM bill WHERE id = :bill_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':bill_id', $bill_id, PDO::PARAM_INT);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Bill deleted successfully']);
    } else {
        throw new Exception('Could not delete bill');
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal server error
    echo json_encode(['success' => false, 'message' => 'Could not delete bill: ' . $e->getMessage()]);
}

// Close the database connection
$conn = null;
?>

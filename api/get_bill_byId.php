<?php
// Include the database connection
require 'db.php';

header('Content-Type: application/json');

// Get the bill_id from the request
$bill_id = isset($_GET['bill_id']) ? $_GET['bill_id'] : null;

if (!$bill_id) {
    http_response_code(400); // Bad request
    echo json_encode(['error' => 'Bill ID is required']);
    exit;
}

try {
    // Prepare the SQL statement to fetch bill based on the bill_id
    $sql = "SELECT * FROM bill WHERE id = :bill_id"; 
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':bill_id', $bill_id, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch the bill record that matches the bill_id
    $bill = $stmt->fetch(PDO::FETCH_ASSOC);

    // Return the bill as JSON
    if ($bill) {
        echo json_encode($bill);
    } else {
        echo json_encode(['message' => 'No bill found for the specified ID']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not fetch bill: ' . $e->getMessage()]);
}

$conn = null;
?>

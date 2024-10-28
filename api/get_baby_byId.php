<?php
// Include the database connection
require 'db.php';

header('Content-Type: application/json');

// Get the baby_id from the request
$baby_id = isset($_GET['baby_id']) ? $_GET['baby_id'] : null;

if (!$baby_id) {
    http_response_code(400); // Bad request
    echo json_encode(['error' => 'Baby ID is required']);
    exit;
}

try {
    // Prepare the SQL statement to fetch baby based on the baby_id
    $sql = "SELECT * FROM baby WHERE id = :baby_id"; 
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':baby_id', $baby_id, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch the baby record that matches the baby_id
    $baby = $stmt->fetch(PDO::FETCH_ASSOC);

    // Return the baby as JSON
    if ($baby) {
        echo json_encode($baby);
    } else {
        echo json_encode(['message' => 'No baby found for the specified ID']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not fetch baby: ' . $e->getMessage()]);
}

$conn = null;
?>

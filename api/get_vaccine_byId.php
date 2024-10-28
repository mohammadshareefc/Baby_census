<?php
// Include the database connection
require 'db.php';

header('Content-Type: application/json');

// Get the vaccine_id from the request
$vaccine_id = isset($_GET['vaccine_id']) ? $_GET['vaccine_id'] : null;

if (!$vaccine_id) {
    http_response_code(400); // Bad request
    echo json_encode(['error' => 'Vaccine ID is required']);
    exit;
}

try {
    // Prepare the SQL statement to fetch vaccine based on the vaccine_id
    $sql = "SELECT * FROM vaccine WHERE id = :vaccine_id"; 
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':vaccine_id', $vaccine_id, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch the vaccine record that matches the vaccine_id
    $vaccine = $stmt->fetch(PDO::FETCH_ASSOC);

    // Return the vaccine as JSON
    if ($vaccine) {
        echo json_encode($vaccine);
    } else {
        echo json_encode(['message' => 'No vaccine found for the specified ID']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not fetch vaccine: ' . $e->getMessage()]);
}

$conn = null;
?>

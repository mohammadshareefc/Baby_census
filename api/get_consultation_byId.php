<?php
// Include the database connection
require 'db.php';

header('Content-Type: application/json');

// Get the consultation_id from the request
$consultation_id = isset($_GET['consultation_id']) ? $_GET['consultation_id'] : null;

if (!$consultation_id) {
    http_response_code(400); // Bad request
    echo json_encode(['error' => 'Consultation ID is required']);
    exit;
}

try {
    // Prepare the SQL statement to fetch consultation based on the consultation_id
    $sql = "SELECT * FROM consultation WHERE id = :consultation_id"; 
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':consultation_id', $consultation_id, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch the consultation record that matches the consultation_id
    $consultation = $stmt->fetch(PDO::FETCH_ASSOC);

    // Return the consultation as JSON
    if ($consultation) {
        echo json_encode($consultation);
    } else {
        echo json_encode(['message' => 'No consultation found for the specified ID']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not fetch consultation: ' . $e->getMessage()]);
}

$conn = null;
?>

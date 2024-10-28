<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');

// Get the treatment_id from the request
$treatment_id = isset($_GET['treatment_id']) ? $_GET['treatment_id'] : null;

if (!$treatment_id) {
    http_response_code(400); // Bad request
    echo json_encode(['error' => 'Treatment ID is required']);
    exit;
}

try {
    // Prepare the SQL statement to fetch treatment based on the treatment_id
    $sql = "SELECT * FROM treatment WHERE id = :treatment_id"; 
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':treatment_id', $treatment_id, PDO::PARAM_INT); // Bind treatment_id parameter as an integer
    $stmt->execute();

    // Fetch the treatment record that matches the treatment_id
    $treatment = $stmt->fetch(PDO::FETCH_ASSOC);

    // Return the treatment as JSON
    if ($treatment) {
        echo json_encode($treatment);
    } else {
        echo json_encode(['message' => 'No treatment found for the specified ID']);
    }
} catch (PDOException $e) {
    // Handle errors and return an error response
    http_response_code(500);
    echo json_encode(['error' => 'Could not fetch treatment: ' . $e->getMessage()]);
}

// Close the database connection (optional, PDO closes it automatically at the end of the script)
$conn = null;
?>

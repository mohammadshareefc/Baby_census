<?php
// Include the database connection
require 'db.php'; // Adjust the path to your database connection file

header('Content-Type: application/json');

// Check if doctor_id is provided in the query string
$doctor_id = isset($_GET['doctor_id']) ? (int)$_GET['doctor_id'] : null;

if (!$doctor_id) {
    http_response_code(400); // Bad request
    echo json_encode(['success' => false, 'message' => 'Doctor ID is required']);
    exit;
}

try {
    // Prepare the SQL statement to delete the doctor
    $sql = "DELETE FROM doctor WHERE id = :doctor_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':doctor_id', $doctor_id, PDO::PARAM_INT);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Doctor deleted successfully']);
    } else {
        throw new Exception('Could not delete doctor');
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal server error
    echo json_encode(['success' => false, 'message' => 'Could not delete doctor: ' . $e->getMessage()]);
}

// Close the database connection
$conn = null;
?>

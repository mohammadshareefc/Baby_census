<?php
// Include the database connection
require 'db.php'; // Adjust the path to your db.php

header('Content-Type: application/json');

try {
    // Check if the request method is POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the form data from the request body
        $data = json_decode(file_get_contents('php://input'), true);

        // Validate form inputs (you can add more validation if needed)
        if (!isset($data['doctorName']) || !isset($data['doctorSpecialization']) || !isset($data['doctorContact']) || !isset($data['hospitalId'])) {
            throw new Exception('Invalid form data');
        }

        // Prepare the SQL statement
        $sql = "INSERT INTO doctor (name, specialization, contact, hospital_id) VALUES (:name, :specialization, :contact, :hospital_id)";
        $stmt = $conn->prepare($sql);

        // Bind parameters
        $stmt->bindParam(':name', $data['doctorName']);
        $stmt->bindParam(':specialization', $data['doctorSpecialization']);
        $stmt->bindParam(':contact', $data['doctorContact']);  // Correct the bind here
        $stmt->bindParam(':hospital_id', $data['hospitalId']);

        // Execute the query
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Doctor added successfully']);
        } else {
            throw new Exception('Failed to insert doctor');
        }
    } else {
        throw new Exception('Invalid request method');
    }
} catch (PDOException $e) {
    // Handle SQL errors
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    // Handle validation or request errors
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}

// Close the connection
$conn = null;
?>

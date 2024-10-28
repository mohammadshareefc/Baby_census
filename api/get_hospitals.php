<?php
// Include the database connection
require 'db.php'; // Adjust the path to your actual db.php file

header('Content-Type: application/json');

try {
    // Prepare SQL to fetch all hospital records
    $sql = "SELECT * FROM hospital";
    $stmt = $conn->prepare($sql);
    
    // Execute the query
    $stmt->execute();
    
    // Fetch all records
    $hospitals = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Return the results as JSON
    echo json_encode(['success' => true, 'data' => $hospitals]);
} catch (PDOException $e) {
    // Return an error message if something goes wrong
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

// Close the database connection (optional)
$conn = null;
?>

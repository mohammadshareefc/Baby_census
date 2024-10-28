<?php
// Include the database connection
require 'db.php';

header('Content-Type: application/json');

try {
    // Get the managerId from the request
    $managerId = isset($_GET['managerId']) ? $_GET['managerId'] : null;

    // Prepare SQL to fetch hospitals for the specific managerId
    $sql = "SELECT * FROM hospital WHERE manager_id = :managerId";
    $stmt = $conn->prepare($sql);

    // Bind the managerId parameter
    $stmt->bindParam(':managerId', $managerId, PDO::PARAM_INT);

    // Execute the query
    $stmt->execute();
    $hospitals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $hospitals]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

// Close the database connection (optional)
$conn = null;
?>

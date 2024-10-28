<?php
// Include the database connection
require 'db.php';

header('Content-Type: application/json');

try {
    // Get the managerId from the request
    $managerId = isset($_GET['managerId']) ? $_GET['managerId'] : null;

    if (!$managerId) {
        echo json_encode(['success' => false, 'message' => 'Invalid manager ID']);
        exit;
    }

    // Prepare SQL to fetch user details
    $userSql = "SELECT id, username, email FROM users WHERE id = :managerId";
    $userStmt = $conn->prepare($userSql);
    $userStmt->bindParam(':managerId', $managerId, PDO::PARAM_INT);
    $userStmt->execute();
    $user = $userStmt->fetch(PDO::FETCH_ASSOC);

    // Check if user exists
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    // Prepare SQL to fetch hospitals for the specific managerId
    $hospitalSql = "SELECT id, name, contact, address, city, email FROM hospital WHERE manager_id = :managerId";
    $hospitalStmt = $conn->prepare($hospitalSql);
    $hospitalStmt->bindParam(':managerId', $managerId, PDO::PARAM_INT);
    $hospitalStmt->execute();
    $hospitals = $hospitalStmt->fetchAll(PDO::FETCH_ASSOC);

    // Send the response with both user and hospital data
    echo json_encode([
        'success' => true,
        'user' => $user,
        'hospitals' => $hospitals
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

// Close the database connection (optional)
$conn = null;
?>

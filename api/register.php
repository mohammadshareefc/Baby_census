<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['username'], $data['email'], $data['password'])) {
    $username = $data['username'];
    $email = $data['email'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT);

    // Update the column name from 'password' to 'password_hash'
    $stmt = $conn->prepare("INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :password_hash)");

    // Bind values
    $stmt->bindValue(':username', $username);
    $stmt->bindValue(':email', $email);
    $stmt->bindValue(':password_hash', $password);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Registration successful']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to register user']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
}
?>

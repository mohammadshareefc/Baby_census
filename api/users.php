<?php
// backend/users.php
include 'db.php';

function registerUser($username, $password, $email) {
    global $conn;
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (username, password_hash, email) VALUES (:username, :password_hash, :email)");
    
    return $stmt->execute([
        'username' => $username,
        'password_hash' => $password_hash,
        'email' => $email
    ]);
}
?>

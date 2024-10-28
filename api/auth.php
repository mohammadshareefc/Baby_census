<?php
// backend/auth.php
include 'db.php';

function adminLogin($username, $password) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM admin WHERE username = :username");
    $stmt->execute(['username' => $username]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin && password_verify($password, $admin['password_hash'])) {
        return $admin;
    }
    return null;
}

function userLogin($username, $password) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($password, $user['password_hash'])) {
        return $user;
    }
    return null;
}
?>

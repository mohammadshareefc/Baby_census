<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['username'], $data['password'])) {
    $username = $data['username'];
    $password = $data['password'];

    // Prepare a statement to check if the user exists
    $stmt = $conn->prepare("SELECT id, username, email, password_hash FROM users WHERE username = :username");
    $stmt->bindValue(':username', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify the password
    if ($user && password_verify($password, $user['password_hash'])) {
        // Successful login
        echo json_encode([
            'success' => true,
            'id' => $user['id'], // Include user ID
            'username' => $user['username'], // Include username
            'email' => $user['email'], // Include email
            'message' => 'Login successful'
        ]);
    } else {
        // Incorrect username or password
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
}
?>

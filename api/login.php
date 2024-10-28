<?php
include 'db.php';  // Include database connection

// Get the data from the request body (JSON format)
$data = json_decode(file_get_contents('php://input'), true);

// Check if the required fields 'username' and 'password' are provided
if (isset($data['username'], $data['password'])) {
    $username = $data['username'];
    $password = $data['password'];

    try {
        // Prepare a statement to check if the admin user exists
        $stmt = $conn->prepare("SELECT id, username, password_hash FROM admin WHERE username = :username");
        $stmt->bindValue(':username', $username);
        $stmt->execute();

        // Fetch the admin user data
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verify if the user exists and the password matches the hashed password
        if ($admin && password_verify($password, $admin['password_hash'])) {
            // Successful login, return the admin's details
            echo json_encode([
                'success' => true,
                'id' => $admin['id'],         // Admin ID
                'username' => $admin['username'], // Admin Username
                'message' => 'Login successful'
            ]);
        } else {
            // Invalid credentials
            echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
        }
    } catch (Exception $e) {
        // Handle any exceptions (e.g., database connection issues)
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    // If username or password is not provided, return an error
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
}
?>

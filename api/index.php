<?php
// backend/index.php
include 'auth.php';
include 'users.php';

session_start();

$request = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($request->action) && $request->action === 'register') {
        // User Registration
        $result = registerUser($request->username, $request->password, $request->email);
        echo json_encode(['success' => $result]);
    } elseif (isset($request->username) && isset($request->password)) {
        // User Login
        $user = userLogin($request->username, $request->password);
        if ($user) {
            $_SESSION['user'] = $user;
            header("Location: ../frontend/home.html");
            exit();
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid user credentials']);
        }
    }
}
?>

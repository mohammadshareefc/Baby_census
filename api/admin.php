<?php
// backend/admin.php
include 'auth.php';

session_start();

$request = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($request->username) && isset($request->password)) {
        $admin = adminLogin($request->username, $request->password);
        if ($admin) {
            $_SESSION['admin'] = $admin;
            header("Location: ../frontend/home.html");
            exit();
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid admin credentials']);
        }
    }
}
?>

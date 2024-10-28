<?php
// Define your password (replace 'yourpassword' with the actual password)
$password = 'admin';

// Hash the password using bcrypt
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Output the hashed password
echo $hashedPassword;
?>

<?php
// backend/db.php
$host = 'localhost';
$db_name = 'baby_census_blog'; // Update this to your database name
$username = 'root'; // Update this if your database username is different
$password = ''; // Update this if your database password is different

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>

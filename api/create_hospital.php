<?php
// Include the database connection
require 'db.php'; // Adjust the path to your actual db.php file

header('Content-Type: application/json');

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Debugging: Log received values
file_put_contents('debug.log', print_r($_POST, true));

try {
    // Get form data
    $name = $_POST['name'];
    $contact = $_POST['contact'];
    $address = $_POST['address'];
    $city = $_POST['city'];
    $email = $_POST['email'];
    $managerId = isset($_POST['managerId']) ? (int)$_POST['managerId'] : null; // Cast to integer

    // Validate input
    if (empty($name) || empty($contact) || empty($address) || empty($city) || empty($email)) {
        echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
        exit;
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
        exit;
    }

    // Prepare SQL to insert new hospital record
    $sql = "INSERT INTO hospital (name, contact, address, city, email, manager_id) VALUES (:name, :contact, :address, :city, :email, :managerId)";
    $stmt = $conn->prepare($sql);

    // Bind parameters
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':contact', $contact);
    $stmt->bindParam(':address', $address);
    $stmt->bindParam(':city', $city);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':managerId', $managerId, PDO::PARAM_INT);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Hospital created successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create hospital']);
        file_put_contents('error.log', 'Execute Error: ' . implode(", ", $stmt->errorInfo()) . "\n", FILE_APPEND);
    }
} catch (PDOException $e) {
    // Return an error message if something goes wrong
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

// Close the database connection (optional)
$conn = null;
?>

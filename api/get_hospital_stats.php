
<?php
// Include the database connection
require 'db.php'; // Adjust the path if necessary

header('Content-Type: application/json');
// Get hospital ID from the request
$hospital_id = isset($_GET['hospital_id']) ? (int)$_GET['hospital_id'] : 0;

if ($hospital_id > 0) {
    // Prepare the queries to count patients, doctors, and babies
    $patientCountQuery = "SELECT COUNT(*) AS patient_count FROM patient WHERE hospital_id = :hospital_id";
    $doctorCountQuery = "SELECT COUNT(*) AS doctor_count FROM doctor WHERE hospital_id = :hospital_id";
    $babyCountQuery = "SELECT COUNT(*) AS baby_count FROM baby WHERE hospital_id = :hospital_id";

    // Execute queries and fetch data
    $stmt = $conn->prepare($patientCountQuery);
    $stmt->bindValue(':hospital_id', $hospital_id, PDO::PARAM_INT);
    $stmt->execute();
    $patientCount = $stmt->fetch(PDO::FETCH_ASSOC)['patient_count'];

    $stmt = $conn->prepare($doctorCountQuery);
    $stmt->bindValue(':hospital_id', $hospital_id, PDO::PARAM_INT);
    $stmt->execute();
    $doctorCount = $stmt->fetch(PDO::FETCH_ASSOC)['doctor_count'];

    $stmt = $conn->prepare($babyCountQuery);
    $stmt->bindValue(':hospital_id', $hospital_id, PDO::PARAM_INT);
    $stmt->execute();
    $babyCount = $stmt->fetch(PDO::FETCH_ASSOC)['baby_count'];

    // Return the results as JSON
    echo json_encode([
        'success' => true,
        'patient_count' => $patientCount,
        'doctor_count' => $doctorCount,
        'baby_count' => $babyCount
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid hospital ID']);
}
?>

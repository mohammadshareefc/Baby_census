<?php
// Include the database connection
require 'db.php'; // Adjust the path to your database connection file

header('Content-Type: application/json');

// Query to get the count of babies born for each month for all hospitals
$sql = "
    SELECT MONTH(b.dob) AS month, COUNT(b.id) AS number_of_births
    FROM baby b
    WHERE YEAR(b.dob) = YEAR(CURDATE())  -- Current year
    GROUP BY month
    ORDER BY month
";

// Prepare and execute the statement
$stmt = $conn->prepare($sql);
$stmt->execute();

// Initialize an array with 12 months (January to December) and 0 births
$months = [
    1 => 'January', 2 => 'February', 3 => 'March', 4 => 'April',
    5 => 'May', 6 => 'June', 7 => 'July', 8 => 'August',
    9 => 'September', 10 => 'October', 11 => 'November', 12 => 'December'
];
$birthCounts = array_fill(1, 12, 0);  // Initialize all months with 0 births

// Fetch the results and update the birthCounts array
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $month = (int)$row['month'];
    $birthCounts[$month] = (int)$row['number_of_births'];
}

// Prepare the final data to send, mapping months to birth counts
$data = [];
foreach ($months as $monthNumber => $monthName) {
    $data[] = [
        'month' => $monthName,
        'number_of_births' => $birthCounts[$monthNumber]
    ];
}

// Send JSON response
$response = [
    'success' => true,
    'data' => $data
];
header('Content-Type: application/json');
echo json_encode($response);

?>

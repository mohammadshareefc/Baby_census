// Function to load HTML content and set it to innerHTML
function loadHTML(containerId, filePath) {
    fetch(filePath)
        .then(response => response.text())  // Get the content of the file
        .then(data => {
            document.getElementById(containerId).innerHTML = data;  // Set it as innerHTML
        })
        .catch(error => console.error('Error loading HTML:', error));
}


// Load the header and navigation HTML
loadHTML('headerContainer', 'header.html');
loadHTML('navContainer', 'nav.html');

// Function to load HTML content and set it to innerHTML
function loadContent(filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();  // Get the content of the file
        })
        .then(data => {
            document.querySelector('.container-main').innerHTML = data;  // Set it as innerHTML
            
            // Call the appropriate function to fetch data based on the loaded page
            const hospitalId = sessionStorage.getItem("hospitalId");
            
            if (filePath.includes('patients.html')) {
                if (hospitalId) {
                    document.getElementById("hospitalId").value = hospitalId;
                    loadPatientData(hospitalId);
                    loadDoctors(hospitalId);
                } else {
                    console.error('No hospitalId found in sessionStorage');
                }
            } 
            else if (filePath.includes('doctors.html')) {
                 // Call the function to fetch doctor data
               
                if (hospitalId) {
                    document.getElementById("hospitalId").value = hospitalId;
                    loadDoctorData(hospitalId);
                } else {
                    console.error('No hospitalId found in sessionStorage');
                }
            }
            else if (filePath.includes('babies.html')) {
                if (hospitalId) {
                    document.getElementById("hospitalId").value = hospitalId;
                    loadBabyData(hospitalId);
                    loadPatients(hospitalId);
    
                } else {
                    console.error('No hospitalId found in sessionStorage');
                }
            }
            else if (filePath.includes('vaccines.html')) {
                if (hospitalId) {
                    document.getElementById("hospitalId").value = hospitalId;
                    loadVaccineData(hospitalId);
                    loadBabies(hospitalId);
                } else {
                    console.error('No hospitalId found in sessionStorage');
                }
            }
            else if (filePath.includes('treatments.html')) {
                if (hospitalId) {
                    document.getElementById("hospitalId").value = hospitalId;
                    loadTreatmentsData(hospitalId);
                    loadPatients(hospitalId);
                } else {
                    console.error('No hospitalId found in sessionStorage');
                }
            }
            else if (filePath.includes('bills.html')) {
                
                if (hospitalId) {
                    document.getElementById("hospitalId").value = hospitalId;
                    loadBillData(hospitalId);
                    loadPatients(hospitalId);
                } else {
                    console.error('No hospitalId found in sessionStorage');
                }
            }
            else if (filePath.includes('consultations.html')) {
                if (hospitalId) {
                    document.getElementById("hospitalId").value = hospitalId;
                    loadConsultationData(hospitalId);
                    loadPatients(hospitalId);
                    loadDoctors(hospitalId);
    
                } else {
                    console.error('No hospitalId found in sessionStorage');
                }
            }
            else if (filePath.includes('dashboard.html')) {
                // fetchHospitals(sessionStorage.getItem('userId')); // Call the function to fetch hospital data
                loadBabiesByMonth(hospitalId);
                loadHospitalStats(hospitalId); 
            }
            else if (filePath.includes('admin-dashboard-view.html')) {
                // fetchHospitals(sessionStorage.getItem('userId')); // Call the function to fetch hospital data
                loadAllBabiesByMonth();
            }
             
            
            // Add more conditions as necessary for other pages
        })
        .catch(error => console.error('Error loading content:', error));
}

// Event listener for navigation links
document.addEventListener('click', function(event) {
    if (event.target.tagName === 'A' && event.target.classList.contains('nav-link')) {
        event.preventDefault(); // Prevent the default link behavior
        const filePath = event.target.getAttribute('href'); // Get the file path from the link

        // Load the appropriate content based on the clicked link
        loadContent(filePath); // Load the content for the selected section
    }
});


function loadBabiesByMonth(hospitalId) {
    fetch(`../api/get_babies_by_month.php?hospital_id=${hospitalId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const months = data.data.map(item => item.month); // Extract month data
                const birthCounts = data.data.map(item => item.number_of_births); // Extract birth count
                renderBabiesByMonthChart(months, birthCounts); // Pass data to chart renderer
            } else {
                console.error('Error fetching data:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function loadAllBabiesByMonth() {
    fetch(`../api/get_all_babies_by_month.php`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const months = data.data.map(item => item.month); // Extract month data
                const birthCounts = data.data.map(item => item.number_of_births); // Extract birth count
                renderBabiesByMonthChart(months, birthCounts); // Pass data to chart renderer
            } else {
                console.error('Error fetching data:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}


function loadHospitalStats(hospitalId) {
    fetch(`../api/get_hospital_stats.php?hospital_id=${hospitalId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('patient_count').textContent = data.patient_count;
                document.getElementById('doctor_count').textContent = data.doctor_count;
                document.getElementById('baby_count').textContent = data.baby_count;
            } else {
                console.error('Error fetching data:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}





function renderBabiesByMonthChart(months, birthCounts) {
    const ctx = document.getElementById('babiesByMonthChart').getContext('2d');
    
    const chart = new Chart(ctx, {
        type: 'bar', // Specify bar chart
        data: {
            labels: months, // Labels for each month
            datasets: [{
                label: 'Number of Babies Born',
                data: birthCounts, // Use fetched birth count data
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Bar color
                borderColor: 'rgba(54, 162, 235, 1)',       // Bar border color
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true, // Start the y-axis at 0
                    ticks: {
                        precision: 0 // Ensure whole numbers on y-axis
                    }
                }
            }
        }
    });
}



//create Patient
function submitPatientForm(e) {
    e.preventDefault(); // Prevent default form submission

    const patientForm = document.getElementById('patientForm');
    const formData = new FormData(patientForm); // Collect form data from the form

   
    const hospitalId = formData.get('hospitalId');

    // Send the form data using fetch API (AJAX)
    fetch('../api/create_patient.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Patient created successfully!');
            closePatientForm(); // Close the form on success
            loadPatientData(hospitalId); // Reload the patient data for the hospital
        } else {
            alert('Failed to create patient: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the patient.');
    });
}


//Fetch Patients
function fetchPatients() {
    fetch('../api/get_patients.php') // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('patientTableBody');
            tbody.innerHTML = ''; // Clear existing data

            if (data.length > 0) {
                data.forEach((patient, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${patient.name}</td>
                        <td>${patient.contact}</td>
                        <td>${patient.aadhaar}</td>
                        <td>${patient.bloodgroup}</td>
                        <td>${patient.husband}</td>
                        <td>${patient.doctor_id}</td>
                        <td><a href="his_admin_view_single_patient.php?pat_id=${patient.id}&pat_number=${patient.contact}" class="badge badge-success"><i class="mdi mdi-eye"></i> View</a></td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="8" class="text-center">No patients found</td>`;
                tbody.appendChild(row);
            }
        })
        .catch(error => console.error('Error fetching patient data:', error));
}


function fetchPatientsByHospital(hospitalId) {
    const url = `../api/get_hospital_patients.php?hospitalId=${hospitalId}`;

    // Return the fetched data so it can be used elsewhere
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching patients:', error);
            return [];
        });
}


function updatePatientTable(patients) {
    const tbody = document.getElementById('patientTableBody');
    tbody.innerHTML = ''; // Clear existing data

    if (patients.length > 0) {
        patients.forEach((patient, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${patient.name || 'N/A'}</td>
                <td>${patient.contact || 'N/A'}</td>
                <td>${patient.aadhaar || 'N/A'}</td>
                <td>${patient.bloodgroup || 'N/A'}</td>
                <td>${patient.husband || 'N/A'}</td> <!-- Handle null for 'husband' field -->
                <td>${patient.doctor_name || 'N/A'}</td> <!-- Display doctor name instead of doctor_id -->
                <td>
                    <a href="#" class="badge badge-success" onclick="viewPatient(${patient.id})">
                        <i class="mdi mdi-eye" style=" font-size: 15px;"></i>
                    </a>
                    <a href="#" class="badge badge-success" onclick="editPatient(${patient.id})">
                       <i class="mdi mdi-pencil" style=" font-size: 15px;"></i>
                    </a>
                    <a href="#" class="badge badge-success" onclick="deletePatient(${patient.id})">
                       <i class="mdi mdi-delete" style="color: red; font-size: 15px;"></i>
                    </a>
                </td>
            `;
                  
            tbody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="8" class="text-center">No patients found</td>`;
        tbody.appendChild(row);
    }
}

function viewPatient(patientId) {
    fetch(`../api/get_patient_byId.php?patient_id=${patientId}`) // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(patient => {
            // Populate the form fields with patient data
            document.getElementById('patientName').value = patient.name || 'N/A';
            document.getElementById('patientContact').value = patient.contact || 'N/A';
            document.getElementById('patientAadhaar').value = patient.aadhaar || 'N/A';
            document.getElementById('patientBloodGroup').value = patient.bloodgroup || 'N/A';
            document.getElementById('patientHusband').value = patient.husband || 'N/A';
            document.getElementById('doctorId').value = patient.doctor_id || 'N/A'; 

            // Disable all input fields to prevent editing
            document.getElementById('patientName').disabled = true;
            document.getElementById('patientContact').disabled = true;
            document.getElementById('patientAadhaar').disabled = true;
            document.getElementById('patientBloodGroup').disabled = true;
            document.getElementById('patientHusband').disabled = true;
            document.getElementById('doctorId').disabled = true;

            // Update heading and button visibility for view mode
            document.querySelector('#patientForm h2').textContent = 'View Patient';
            document.getElementById('patientSubmitButton').style.display = 'none';

            // Display the popup
            document.getElementById('patientPopup').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching patient data:', error));
}

function editPatient(patientId) {
    fetch(`../api/get_patient_byId.php?patient_id=${patientId}`) 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(patient => {
            // Populate the form fields with patient data
           
            document.getElementById('patientName').value = patient.name || 'N/A';
            document.getElementById('patientContact').value = patient.contact || 'N/A';
            document.getElementById('patientAadhaar').value = patient.aadhaar || 'N/A';
            document.getElementById('patientBloodGroup').value = patient.bloodgroup || 'N/A';
            document.getElementById('patientHusband').value = patient.husband || 'N/A';
            document.getElementById('doctorId').value = patient.doctor_id || 'N/A'; 

            // Disable all input fields to prevent editing
            document.getElementById('doctorId').disabled = true;

            // Update heading and button visibility for view mode
            document.querySelector('#patientForm h2').textContent = 'Edit Patient';
            document.getElementById('patientSubmitButton').style.display = 'block';
            document.getElementById('patientSubmitButton').textContent = 'Update';
            document.getElementById('patientSubmitButton').onclick = (event) => updatePatient(event, patientId);

            // Display the popup
            document.getElementById('patientPopup').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching patient data:', error));
}

function updatePatient(event, patientId) { // Accept patientId as a parameter
    event.preventDefault(); // Prevent form from submitting normally
    
    // Collect form data
    const patientData = {
        patientName: document.getElementById('patientName').value,
        patientContact: document.getElementById('patientContact').value,
        patientAadhaar: document.getElementById('patientAadhaar').value,
        patientBloodGroup: document.getElementById('patientBloodGroup').value,
        patientHusband: document.getElementById('patientHusband').value,
        doctorId: document.getElementById('doctorId').value,
        hospitalId: document.getElementById('hospitalId').value
    };

    // Make an AJAX request to update the patient data using the patientId in the URL
    fetch(`../api/update_patient.php/${patientId}`, { // Use patientId in the URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const hospitalId = document.getElementById('hospitalId').value;
            alert('Patient updated successfully.');
            loadPatientData(hospitalId);
            closePatientForm();

        } else {
            alert('Error updating patient: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the patient.');
    });
}


function deletePatient(patientId) {
    if (confirm("Are you sure you want to delete this patient?")) {
        fetch(`../api/delete_patient.php?patient_id=${patientId}`, { // Adjust the path as needed
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const hospitalId = sessionStorage.getItem("hospitalId");
                alert('Patient deleted successfully.');
                loadPatientData(hospitalId); // Function to reload the patient data table
            } else {
                alert('Error deleting patient: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the patient.');
        });
    }
}



function showPatientForm() {
    document.getElementById('patientForm').reset(); // Clear the form fields for a new patient
    document.getElementById('hospitalId').value= sessionStorage.getItem("hospitalId");
    // Enable all input fields for creating a new patient
    document.getElementById('patientName').disabled = false;
    document.getElementById('patientContact').disabled = false;
    document.getElementById('patientAadhaar').disabled = false;
    document.getElementById('patientBloodGroup').disabled = false;
    document.getElementById('patientHusband').disabled = false;
    document.getElementById('doctorId').disabled = false; 

    // Update the heading for new patient creation
    document.querySelector('#patientForm h2').textContent = 'Create New Patient';
    document.getElementById('patientSubmitButton').style.display = 'block'; 
    document.getElementById('patientSubmitButton').textContent = 'Create';
    document.getElementById('patientSubmitButton').onclick = (event) => submitPatientForm(event);

    // Display the popup for patient form
    document.getElementById("patientPopup").style.display = "flex";
}

function closePatientForm() {
    // Hide the patient form popup
    document.getElementById("patientPopup").style.display = "none";
}

function arrangePatientSelect(patients) {
    const patientSelect = document.getElementById('patientId');
    patientSelect.innerHTML = '<option value="">Select a patient</option>'; // Clear existing options

    patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id; // Assuming `id` is the field for the patient's ID
        option.textContent = patient.name; // Assuming `name` is the field for the patient's name
        patientSelect.appendChild(option);
    });
}

// Function to load patients and populate the select options
function loadPatients(hospitalId) {
    fetchPatientsByHospital(hospitalId)
        .then(patients => {
            arrangePatientSelect(patients); // Call the function to arrange the select options
        })
        .catch(error => console.error('Error loading patients:', error));
}


function loadPatientData(hospitalId) {
    fetchPatientsByHospital(hospitalId)
        .then(patients => {
            updatePatientTable(patients);
        });
}

// Submit the doctor form
function submitDoctorForm(event) {
    event.preventDefault(); // Prevent default form submission

    const doctorForm = document.getElementById('doctorForm');
    
    // Collect form data
    const formData = new FormData(doctorForm);
    
    // Convert form data to JSON format
    const data = {
        doctorName: formData.get('doctorName'),
        doctorSpecialization: formData.get('doctorSpecialization'),
        doctorContact: formData.get('doctorContact'),
        hospitalId: formData.get('hospitalId')
    };

    // Send the form data using fetch API (AJAX)
    fetch('../api/create_doctor.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Doctor created successfully!');
            closeDoctorForm();  // Close the form on success
            loadDoctorData(sessionStorage.getItem("hospitalId"));
        } else {
            alert('Failed to create doctor: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the doctor.');
    });
}



// Fetch doctors from the backend
function fetchDoctors() {
    return fetch('../api/get_doctors.php') // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching doctor data:', error);
            return [];
        });
}
// Fetch doctors by hospitalId from the backend
function fetchDoctorsByHospital(hospitalId) {
    const url = `../api/get_hospital_doctors.php?hospitalId=${hospitalId}`;

    // Return the fetched data so it can be used elsewhere
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching doctors:', error);
            return [];
        });
}

function updateDoctorTable(doctors) {
    const tbody = document.getElementById('doctorTableBody');
    tbody.innerHTML = ''; // Clear existing data

    if (doctors.length > 0) {
        doctors.forEach((doctor, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${doctor.name || 'N/A'}</td>
                <td>${doctor.specialization || 'N/A'}</td>
                <td>${doctor.contact || 'N/A'}</td>
                <td>
                    <a href="#" class="badge badge-success" onclick="viewDoctor(${doctor.id})">
                        <i class="mdi mdi-eye" style=" font-size: 15px;"></i>
                    </a>
                    <a href="#" class="badge badge-success" onclick="editDoctor(${doctor.id})">
                        <i class="mdi mdi-pencil" style="font-size: 15px;"></i> 
                    </a>
                     <a href="#" class="badge badge-success" onclick="deleteDoctor(${doctor.id})">
                       <i class="mdi mdi-delete" style="color: red; font-size: 15px;"></i>
                    </a>
                </td>
            `;
            tbody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6" class="text-center">No doctors found</td>`;
        tbody.appendChild(row);
    }
}



function viewDoctor(doctorId) {
    fetch(`../api/get_doctor_byId.php?doctor_id=${doctorId}`) // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(doctor => {
            // Populate the form fields with doctor data
            document.getElementById('doctorName').value = doctor.name || 'N/A';
            document.getElementById('doctorSpecialization').value = doctor.specialization || 'N/A';
            document.getElementById('doctorContact').value = doctor.contact || 'N/A';
            document.getElementById('hospitalId').value = doctor.hospital_id || 'N/A'; // Hidden field

            // Disable all input fields to prevent editing
            document.getElementById('doctorName').disabled = true;
            document.getElementById('doctorSpecialization').disabled = true;
            document.getElementById('doctorContact').disabled = true;
            document.getElementById('hospitalId').disabled = true;

            // Update heading and button visibility for view mode
            document.querySelector('#doctorForm h2').textContent = 'View Doctor';
            document.getElementById('doctorSubmitButton').style.display = 'none'; // Hide the submit button

            // Display the popup
            document.getElementById('doctorPopup').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching doctor data:', error));
}

function editDoctor(doctorId) {
    fetch(`../api/get_doctor_byId.php?doctor_id=${doctorId}`) // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(doctor => {
            // Populate the form fields with doctor data
            document.getElementById('doctorName').value = doctor.name || 'N/A';
            document.getElementById('doctorSpecialization').value = doctor.specialization || 'N/A';
            document.getElementById('doctorContact').value = doctor.contact || 'N/A';
            document.getElementById('hospitalId').value = doctor.hospital_id || 'N/A'; // Hidden field

            // Enable fields for editing
            document.getElementById('doctorName').disabled = false;
            document.getElementById('doctorSpecialization').disabled = false;
            document.getElementById('doctorContact').disabled = false;

            // Update heading and button visibility for edit mode
            document.querySelector('#doctorForm h2').textContent = 'Edit Doctor';
            document.getElementById('doctorSubmitButton').style.display = 'block';
            document.getElementById('doctorSubmitButton').textContent = 'Update';
            document.getElementById('doctorSubmitButton').onclick = (event) => updateDoctor(event, doctorId);

            // Display the popup
            document.getElementById('doctorPopup').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching doctor data:', error));
}

function updateDoctor(event, doctorId) { // Accept doctorId as a parameter
    event.preventDefault(); // Prevent form from submitting normally
    
    // Collect form data
    const doctorData = {
        doctorName: document.getElementById('doctorName').value,
        doctorSpecialization: document.getElementById('doctorSpecialization').value,
        doctorContact: document.getElementById('doctorContact').value,
        hospitalId: document.getElementById('hospitalId').value 
    };

    // Make an AJAX request to update the doctor data using the doctorId in the URL
    fetch(`../api/update_doctor.php/${doctorId}`, { // Use doctorId in the URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doctorData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const hospitalId = document.getElementById('hospitalId').value;
            alert('Doctor updated successfully.');
            loadDoctorData(hospitalId); 
            closeDoctorForm();
        } else {
            alert('Error updating doctor: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the doctor.');
    });
}

function deleteDoctor(doctorId) {
    if (confirm("Are you sure you want to delete this doctor?")) {
        fetch(`../api/delete_doctor.php?doctor_id=${doctorId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const hospitalId = sessionStorage.getItem("hospitalId");
                alert('Doctor deleted successfully.');
                loadDoctorData(hospitalId); 
            } else {
                alert('Error deleting doctor: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the doctor.');
        });
    }
}

function showDoctorForm() {
    document.getElementById('doctorForm').reset(); // Clear the form fields for a new doctor
    document.getElementById('hospitalId').value= sessionStorage.getItem("hospitalId");
    // Enable all input fields for creating a new doctor
    document.getElementById('doctorName').disabled = false;
    document.getElementById('doctorSpecialization').disabled = false;
    document.getElementById('doctorContact').disabled = false;
    document.getElementById('hospitalId').disabled = false; // Hidden field, but enabled for new entries

    // Update the heading for new doctor creation
    document.querySelector('#doctorForm h2').textContent = 'Create New Doctor';
    document.getElementById('doctorSubmitButton').style.display = 'block';
    document.getElementById('doctorSubmitButton').textContent = 'Create';
    document.getElementById('doctorSubmitButton').onclick = (event) => submitDoctorForm(event);

    // Display the popup for doctor form
    document.getElementById("doctorPopup").style.display = "flex";
}

function closeDoctorForm() {
    // Hide the doctor form popup
    document.getElementById("doctorPopup").style.display = "none";
}


function loadDoctorData(hospitalId) {
    fetchDoctorsByHospital(hospitalId)
        .then(doctors => {
            updateDoctorTable(doctors);
        });
}


function arrangeDoctorSelect(doctors) {
    const doctorSelect = document.getElementById('doctorId');
    doctorSelect.innerHTML = '<option value="">Select a doctor</option>'; // Clear existing options

    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id; // Assuming `id` is the field for the doctor's ID
        option.textContent = doctor.name; // Assuming `name` is the field for the doctor's name
        doctorSelect.appendChild(option);
    });
}

// Function to load doctors and populate the select options
function loadDoctors(hospitalId) {
    fetchDoctorsByHospital(hospitalId)
        .then(doctors => {
            arrangeDoctorSelect(doctors); // Call the separate function to arrange the select
        })
        .catch(error => console.error('Error loading doctors:', error));
}



// Function to submit the baby form
function submitBabyForm(e) {
    e.preventDefault(); // Prevent default form submission

    const babyForm = document.getElementById('babyForm');
    const formData = new FormData(babyForm); // Collect form data from the form

    
    const hospitalId = formData.get('hospitalId');


    // Send the form data using fetch API (AJAX)
    fetch('../api/create_baby.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Baby created successfully!');
            closeBabyForm(); // Close the form on success
            loadBabyData(hospitalId); // Reload the baby data for the hospital
        } else {
            alert('Failed to create baby: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the baby.');
    });
}


// Fetch babies by hospitalId from the backend
function fetchBabiesByHospital(hospitalId) {
    const url = `../api/get_hospital_babies.php?hospitalId=${hospitalId}`;

    // Return the fetched data so it can be used elsewhere
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching babies:', error);
            return [];
        });
}

// Function to update the baby table with fetched data

function updateBabyTable(babies) {
    const tbody = document.getElementById('babyTableBody');
    tbody.innerHTML = ''; // Clear existing data

    if (babies.length > 0) {
        babies.forEach((baby, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${baby.gender || 'N/A'}</td>
                <td>${baby.dob || 'N/A'}</td>
                <td>${baby.weight || 'N/A'}</td>
                <td>${baby.health_status || 'N/A'}</td>
                <td>${baby.patient_name || 'N/A'}</td> <!-- Display patient name -->
                <td>
                    <a href="#" class="badge badge-success" onclick="viewBaby(${baby.id})">
                        <i class="mdi mdi-eye" style="font-size: 15px;"></i>
                    </a>
                     <a href="#" class="badge badge-success" onclick="editBaby(${baby.id})">
                       <i class="mdi mdi-pencil" style="font-size: 15px;"></i> 
                    </a>
                    <a href="#" class="badge badge-success" onclick="deleteBaby(${baby.id})">
                       <i class="mdi mdi-delete" style="color: red; font-size: 15px;"></i> 
                    </a>
                </td>
            `;
            tbody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" class="text-center">No babies found</td>`;
        tbody.appendChild(row);
    }
}


function viewBaby(babyId) {
    fetch(`../api/get_baby_byId.php?baby_id=${babyId}`) // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(baby => {
            // Populate the form fields with baby data
            document.getElementById('babyGender').value = baby.gender || 'N/A';
            document.getElementById('babyDob').value = baby.dob || 'N/A';
            document.getElementById('babyWeight').value = baby.weight || 'N/A';
            document.getElementById('babyHealthStatus').value = baby.health_status || 'N/A';
            document.getElementById('patientId').value = baby.patient_id || 'N/A'; // Assuming this is a dropdown

            // Disable all input fields to prevent editing
            document.getElementById('babyGender').disabled = true;
            document.getElementById('babyDob').disabled = true;
            document.getElementById('babyWeight').disabled = true;
            document.getElementById('babyHealthStatus').disabled = true;
            document.getElementById('patientId').disabled = true; // Disable patient ID dropdown

            // Update heading and button visibility for view mode
            document.querySelector('#babyForm h2').textContent = 'View Baby';
            document.getElementById('babySubmitButton').style.display = 'none'; // Hide the submit button

            // Display the popup
            document.getElementById('babyPopup').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching baby data:', error));
}

function editBaby(babyId) {
    fetch(`../api/get_baby_byId.php?baby_id=${babyId}`) 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(baby => {
            // Populate the form fields with baby data
            document.getElementById('babyGender').value = baby.gender || 'N/A';
            document.getElementById('babyDob').value = baby.dob || 'N/A';
            document.getElementById('babyWeight').value = baby.weight || 'N/A';
            document.getElementById('babyHealthStatus').value = baby.health_status || 'N/A';
            document.getElementById('patientId').value = baby.patient_id || 'N/A'; 

            
            document.getElementById('babyGender').disabled = false;
            document.getElementById('babyDob').disabled = false;
            document.getElementById('babyWeight').disabled = false;
            document.getElementById('babyHealthStatus').disabled = false;
            document.getElementById('patientId').disabled = true; 

            // Update heading and button visibility for edit mode
            document.querySelector('#babyForm h2').textContent = 'Edit Baby';
            document.getElementById('babySubmitButton').style.display = 'block';
            document.getElementById('babySubmitButton').textContent = 'Update';
            document.getElementById('babySubmitButton').onclick = (event) => updateBaby(event, babyId);

            // Display the popup
            document.getElementById('babyPopup').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching baby data:', error));
}

function updateBaby(event, babyId) { // Accept babyId as a parameter
    event.preventDefault(); // Prevent form from submitting normally
    
    // Collect form data
    const babyData = {
        babyGender: document.getElementById('babyGender').value,
        babyDob: document.getElementById('babyDob').value,
        babyWeight: document.getElementById('babyWeight').value,
        babyHealthStatus: document.getElementById('babyHealthStatus').value,
        patientId: document.getElementById('patientId').value ,
        hospitalId: document.getElementById('hospitalId').value 
    };

    // Make an AJAX request to update the baby data using the babyId in the URL
    fetch(`../api/update_baby.php/${babyId}`, { // Use babyId in the URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(babyData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const hospitalId = document.getElementById('hospitalId').value;
            alert('Baby updated successfully.');
            loadBabyData(hospitalId); // Function to reload the baby data table
            closeBabyForm(); // Function to close the popup
        } else {
            alert('Error updating baby: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the baby.');
    });
}


function deleteBaby(babyId) {
    if (confirm("Are you sure you want to delete this baby record?")) {
        fetch(`../api/delete_baby.php?baby_id=${babyId}`, { // Adjust the path to your API location
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const hospitalId = sessionStorage.getItem("hospitalId");
                alert('Baby record deleted successfully.');
                loadBabyData(hospitalId); // Reload the baby data to update the table
            } else {
                alert('Error deleting baby record: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the baby record.');
        });
    }
}

function showBabyForm() {
    document.getElementById('babyForm').reset(); // Clear the form fields for a new baby
    document.getElementById('hospitalId').value= sessionStorage.getItem("hospitalId");
    // Enable all input fields for creating a new baby
    document.getElementById('babyGender').disabled = false;
    document.getElementById('babyDob').disabled = false;
    document.getElementById('babyWeight').disabled = false;
    document.getElementById('babyHealthStatus').disabled = false;
    document.getElementById('patientId').disabled = false; // Enable patient ID dropdown

    // Update the heading for new baby creation
    document.querySelector('#babyForm h2').textContent = 'Create New Baby';
    document.getElementById('babySubmitButton').style.display = 'block';
    document.getElementById('babySubmitButton').textContent = 'Create';
    document.getElementById('babySubmitButton').onclick = (event) => submitBabyForm(event);

    // Display the popup for baby form
    document.getElementById("babyPopup").style.display = "flex";
}

function closeBabyForm() {
    // Hide the baby form popup
    document.getElementById("babyPopup").style.display = "none";
}

// Load baby data for the specified hospitalId
function loadBabyData(hospitalId) {
    fetchBabiesByHospital(hospitalId)
        .then(babies => {
            updateBabyTable(babies);
        });
}


// Function to populate the baby select options in the vaccine form
function arrangeBabySelect(babies) {
    const babySelect = document.getElementById('babyId');
    babySelect.innerHTML = '<option value="">Select a baby</option>'; // Clear existing options

    babies.forEach(baby => {
        const option = document.createElement('option');
        const babyId= baby.id;
        option.value = babyId; // Assuming `id` is the field for the baby's ID
        option.textContent = babyId; // Assuming `name` is the field for the baby's name
        babySelect.appendChild(option);
    });
}

// Function to load babies and populate the select options in the vaccine form
function loadBabies(hospitalId) {
    fetchBabiesByHospital(hospitalId)
        .then(babies => {
            arrangeBabySelect(babies); // Call the function to arrange the select options
        })
        .catch(error => console.error('Error loading babies:', error));
}


//Fetch babies:

function fetchBabies() {
    fetch('../api/get_babies.php') // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('babyTableBody'); // Ensure you have the correct ID
            tbody.innerHTML = ''; // Clear existing data

            if (data.length > 0) {
                data.forEach((baby, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${baby.name}</td>
                        <td>${baby.gender === 'M' ? 'Male' : 'Female'}</td>
                        <td>${new Date(baby.dob).toLocaleDateString()}</td>
                        <td>${baby.weight}</td>
                        <td>${baby.health_status}</td>
                        <td>${baby.patient_id}</td>
                        <td><a href="baby_view.php?baby_id=${baby.id}" class="badge badge-success"><i class="mdi mdi-eye"></i> View</a></td>
                    `;
                    tbody.appendChild(row);
                });
                console.log("Babies found");
            } else {
                console.log("No babies found");
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="8" class="text-center">No babies found</td>`;
                tbody.appendChild(row);
            }
        })
        .catch(error => console.error('Error fetching baby data:', error));
}

// Function to submit the vaccine form
function submitVaccineForm(e) {
    e.preventDefault(); // Prevent default form submission

    const vaccineForm = document.getElementById('vaccineForm');
    const formData = new FormData(vaccineForm); // Collect form data from the form

 
    const hospitalId = formData.get('hospitalId');
   

    // Send the form data using fetch API (AJAX)
    fetch('../api/create_vaccine.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Vaccine created successfully!');
            closeVaccineForm(); // Close the form on success
            loadVaccineData(hospitalId); // Reload the vaccine data for the hospital
        } else {
            alert('Failed to create vaccine: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the vaccine.');
    });
}



// Fetch vaccines by hospitalId from the backend
function fetchVaccinesByHospital(hospitalId) {
    const url = `../api/get_hospital_vaccines.php?hospitalId=${hospitalId}`;

    // Return the fetched data so it can be used elsewhere
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching vaccines:', error);
            return [];
        });
}

// Function to update the vaccine table with fetched data
function updateVaccineTable(vaccines) {
    const tbody = document.getElementById('vaccineTableBody');
    tbody.innerHTML = ''; // Clear existing data

    if (vaccines.length > 0) {
        vaccines.forEach((vaccine, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${vaccine.name || 'N/A'}</td>
                <td>${vaccine.date_of_vaccination || 'N/A'}</td>
                <td>${vaccine.baby_id || 'N/A'}</td>
                <td>
                    <a href="#" class="badge badge-success" onclick="viewVaccine(${vaccine.id})">
                        <i class="mdi mdi-eye"  style="font-size: 15px;"></i>
                    </a>
                    <a href="#" class="badge badge-success" onclick="editVaccine(${vaccine.id})">
                        <i class="mdi mdi-pencil" style="font-size: 15px;"></i> 
                    </a>
                    <a href="#" class="badge badge-success" onclick="deleteVaccine(${vaccine.id})">
                        <i class="mdi mdi-delete" style="color: red; font-size: 15px;"></i> 
                    </a>
                </td>
            `;
            tbody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" class="text-center">No vaccines found</td>`;
        tbody.appendChild(row);
    }
}

function viewVaccine(vaccineId) {
    fetch(`../api/get_vaccine_byId.php?vaccine_id=${vaccineId}`) // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(vaccine => {
            // Populate the form fields with vaccine data
            document.getElementById('vaccineName').value = vaccine.name || 'N/A';
            document.getElementById('vaccinationDate').value = vaccine.date_of_vaccination || 'N/A';
            document.getElementById('babyId').value = vaccine.baby_id || 'N/A'; // Assuming this is a dropdown

            // Disable all input fields to prevent editing
            document.getElementById('vaccineName').disabled = true;
            document.getElementById('vaccinationDate').disabled = true;
            document.getElementById('babyId').disabled = true; // Disable baby ID dropdown

            // Update heading and button visibility for view mode
            document.querySelector('#vaccineForm h2').textContent = 'View Vaccine';
            document.getElementById('vaccineSubmitButton').style.display = 'none'; // Hide the submit button

            // Display the popup
            document.getElementById('vaccinePopup').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching vaccine data:', error));
}

function editVaccine(vaccineId) {
    fetch(`../api/get_vaccine_byId.php?vaccine_id=${vaccineId}`) // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(vaccine => {
            // Populate the form fields with vaccine data
            document.getElementById('vaccineName').value = vaccine.name || 'N/A';
            document.getElementById('vaccinationDate').value = vaccine.date_of_vaccination || 'N/A';
            document.getElementById('babyId').value = vaccine.baby_id || 'N/A'; 

            // Enable fields for editing
            document.getElementById('vaccineName').disabled = false;
            document.getElementById('vaccinationDate').disabled = false;
            document.getElementById('babyId').disabled = true;

            // Update heading and button visibility for edit mode
            document.querySelector('#vaccineForm h2').textContent = 'Edit Vaccine';
             document.getElementById('vaccineSubmitButton').style.display = 'block';
            document.getElementById('vaccineSubmitButton').textContent = 'Update';
            document.getElementById('vaccineSubmitButton').onclick = (event) => updateVaccine(event, vaccineId);

            // Display the popup
            document.getElementById('vaccinePopup').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching vaccine data:', error));
}

function updateVaccine(event, vaccineId) { // Accept vaccineId as a parameter
    event.preventDefault(); // Prevent form from submitting normally

    // Collect form data
    const vaccineData = {
        vaccineName: document.getElementById('vaccineName').value,
        vaccinationDate: document.getElementById('vaccinationDate').value,
        babyId: document.getElementById('babyId').value ,
        hospitalId: document.getElementById('hospitalId').value 
    };

    // Make an AJAX request to update the vaccine data using the vaccineId in the URL
    fetch(`../api/update_vaccine.php/${vaccineId}`, { // Use vaccineId in the URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(vaccineData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const hospitalId = document.getElementById('hospitalId').value;
            alert('Vaccine updated successfully.');
            loadVaccineData(hospitalId); // Function to reload the vaccine data table
            closeVaccineForm(); // Function to close the popup
        } else {
            alert('Error updating vaccine: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the vaccine.');
    });
}

function deleteVaccine(vaccineId) {
    if (confirm("Are you sure you want to delete this vaccine record?")) {
        fetch(`../api/delete_vaccine.php?vaccine_id=${vaccineId}`, { // Adjust the path to your API location
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const hospitalId = sessionStorage.getItem("hospitalId");
                alert('Vaccine record deleted successfully.');
                loadVaccineData(hospitalId); // Reload the vaccine data to update the table
            } else {
                alert('Error deleting vaccine record: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the vaccine record.');
        });
    }
}

function showVaccineForm() {
    document.getElementById('vaccineForm').reset(); // Clear the form fields for a new vaccine
    document.getElementById('hospitalId').value= sessionStorage.getItem("hospitalId");
    // Enable all input fields for creating a new vaccine
    document.getElementById('vaccineName').disabled = false;
    document.getElementById('vaccinationDate').disabled = false;
    document.getElementById('babyId').disabled = false; // Enable baby ID dropdown

    // Update the heading for new vaccine creation
    document.querySelector('#vaccineForm h2').textContent = 'Create New Vaccine';
    document.getElementById('vaccineSubmitButton').style.display = 'block'; 
    document.getElementById('vaccineSubmitButton').textContent = 'Create';
    document.getElementById('vaccineSubmitButton').onclick = (event) => submitVaccineForm(event);

    // Display the popup for vaccine form
    document.getElementById("vaccinePopup").style.display = "flex";
}

function closeVaccineForm() {
    // Hide the vaccine form popup
    document.getElementById("vaccinePopup").style.display = "none";
}


// Load vaccine data for the specified hospitalId
function loadVaccineData(hospitalId) {
    fetchVaccinesByHospital(hospitalId)
        .then(vaccines => {
            updateVaccineTable(vaccines);
        });
}



// Fecth vaccines

function fetchVaccines() {
    fetch('../api/get_vaccines.php') // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('vaccineTableBody'); // Ensure you have the correct ID
            tbody.innerHTML = ''; // Clear existing data

            if (data.length > 0) {
                data.forEach((vaccine, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${vaccine.name}</td>
                        <td>${vaccine.date_of_vaccination}</td>
                        <td>${vaccine.baby_id}</td>
                        <td><a href="vaccine_view.php?vaccine_id=${vaccine.id}" class="badge badge-success"><i class="mdi mdi-eye"></i> View</a></td>
                    `;
                    tbody.appendChild(row);
                });
                console.log("Vaccines found");
            } else {
                console.log("No vaccines found");
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="5" class="text-center">No vaccines found</td>`;
                tbody.appendChild(row);
            }
        })
        .catch(error => console.error('Error fetching vaccine data:', error));
}

function showTreatmentForm() {
    document.getElementById('treatmentForm').reset(); // Clear the form fields for a new treatment
    document.getElementById('hospitalId').value= sessionStorage.getItem("hospitalId");
    // Enable all input fields for creating a new treatment
    document.getElementById('treatmentName').disabled = false;
    document.getElementById('prescription').disabled = false;
    document.getElementById('patientId').disabled = false; // Allow selecting a patient
    document.getElementById('hospitalId').disabled = false; // This is hidden, adjust if needed
    document.querySelector('#treatmentForm h2').textContent = 'Create New Treatment';
    document.getElementById("treatmentPopup").style.display = "flex";
    document.getElementById('treatmentSubmitButton').textContent = 'Create';
    document.getElementById('treatmentSubmitButton').onclick = (event) => submitTreatmentForm(event);
}

function closeTreatmentForm() {
    document.getElementById("treatmentPopup").style.display = "none";
}

function submitTreatmentForm(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way
    const formData = new FormData(document.getElementById("treatmentForm"));
    const hospitalId = formData.get('hospitalId');

    fetch('../api/create_treatment.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response data here (e.g., updating the table)
        if (data.success) {
            alert('Treatment created successfully!');
            closeTreatmentForm();
            document.getElementById('treatmentForm').reset();
            loadTreatmentsData(hospitalId); // You may want to call a function to refresh the treatments table
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Fetch treatments by hospitalId from the backend
function fetchTreatmentsByHospital(hospitalId) {
    const url = `../api/get_hospital_treatments.php?hospitalId=${hospitalId}`;

    // Return the fetched data so it can be used elsewhere
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching treatments:', error);
            return [];
        });
}


// Function to update the treatment table with fetched data
function updateTreatmentTable(treatments) {
    const tbody = document.getElementById('treatmentTableBody');
    tbody.innerHTML = ''; // Clear existing data

    if (treatments.length > 0) {
        treatments.forEach((treatment, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${treatment.name || 'N/A'}</td>
                <td>${treatment.prescription || 'N/A'}</td>
                <td>${treatment.patient_name || 'N/A'}</td> <!-- Display patient name here -->
                <td>
                    <a href="#" class="badge badge-success" onclick="viewTreatment(${treatment.id})">
                        <i class="mdi mdi-eye" style="font-size: 15px;"></i>
                    </a>
                    <a href="#" class="badge badge-success" onclick="editTreatment(${treatment.id})">
                        <i class="mdi mdi-pencil" style="font-size: 15px;"></i>
                    </a>
                    <a href="#" class="badge badge-success" onclick="deleteTreatment(${treatment.id})">
                        <i class="mdi mdi-delete" style="color: red; font-size: 15px;"></i>
                    </a>
                </td>
            `;
            tbody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6" class="text-center">No treatments found</td>`;
        tbody.appendChild(row);
    }
}

function viewTreatment(treatmentId) {
    fetch(`../api/get_treatment_byId.php?treatment_id=${treatmentId}`) // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(treatment => {
            // Populate the form fields with the treatment data
            document.getElementById('treatmentName').value = treatment.name || 'N/A';
            document.getElementById('prescription').value = treatment.prescription || 'N/A';
            document.getElementById('patientId').value = treatment.patient_id || 'N/A'; // Make sure this value is valid in your select
            document.getElementById('hospitalId').value = treatment.hospital_id || 'N/A'; // Adjust if needed

            // Disable all input fields to prevent editing
            document.getElementById('treatmentName').disabled = true;
            document.getElementById('prescription').disabled = true;
            document.getElementById('patientId').disabled = true; // For select, this will prevent selection changes
            document.getElementById('hospitalId').disabled = true; // This is hidden but can be disabled too

            document.querySelector('#treatmentForm h2').textContent = 'View Treatment';
            document.getElementById('treatmentSubmitButton').style.display = 'none'; // Hide the submit button
            // Display the popup
            document.getElementById('treatmentPopup').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching treatment data:', error));
}

function editTreatment(treatmentId) {
    fetch(`../api/get_treatment_byId.php?treatment_id=${treatmentId}`) // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(treatment => {
            // Populate the form fields with the treatment data
            document.getElementById('treatmentName').value = treatment.name || 'N/A';
            document.getElementById('prescription').value = treatment.prescription || 'N/A';
            document.getElementById('patientId').value = treatment.patient_id || 'N/A'; // Assuming this is a dropdown
            document.getElementById('hospitalId').value = treatment.hospital_id || 'N/A'; // Adjust if needed

            // Enable fields for editing
            document.getElementById('treatmentName').disabled = false;
            document.getElementById('prescription').disabled = false;
            document.getElementById('patientId').disabled = true; 

            // Update heading and button visibility for edit mode
            document.querySelector('#treatmentForm h2').textContent = 'Edit Treatment';
             document.getElementById('treatmentSubmitButton').style.display = 'block';
            document.getElementById('treatmentSubmitButton').textContent = 'Update';
            document.getElementById('treatmentSubmitButton').onclick = (event) => updateTreatment(event, treatmentId);

            // Display the popup
            document.getElementById('treatmentPopup').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching treatment data:', error));
}

function updateTreatment(event, treatmentId) { // Accept treatmentId as a parameter
    event.preventDefault(); // Prevent form from submitting normally

    // Collect form data
    const treatmentData = {
        name: document.getElementById('treatmentName').value,
        prescription: document.getElementById('prescription').value,
        patient_id: document.getElementById('patientId').value, // Assuming this is a dropdown
        hospital_id: document.getElementById('hospitalId').value // Adjust as necessary
    };

    // Make an AJAX request to update the treatment data using the treatmentId in the URL
    fetch(`../api/update_treatment.php/${treatmentId}`, { // Use treatmentId in the URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(treatmentData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const hospitalId = document.getElementById('hospitalId').value;
            alert('Treatment updated successfully.');
            loadTreatmentData(hospitalId); // Function to reload the treatment data table
            closeTreatmentForm(); // Function to close the popup
        } else {
            alert('Error updating treatment: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the treatment.');
    });
}

function deleteTreatment(treatmentId) {
    if (confirm("Are you sure you want to delete this treatment record?")) {
        fetch(`../api/delete_treatment.php?treatment_id=${treatmentId}`, { // Adjust the path to your API location
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const hospitalId = sessionStorage.getItem("hospitalId");
                alert('Treatment record deleted successfully.');
                loadTreatmentData(hospitalId); // Reload the treatment data to update the table
            } else {
                alert('Error deleting treatment record: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the treatment record.');
        });
    }
}

// Load treatment data for the specified hospitalId
function loadTreatmentsData(hospitalId) {
    fetchTreatmentsByHospital(hospitalId)
        .then(treatments => {
            updateTreatmentTable(treatments);
        });
}



//Fetch treatments
function fetchTreatments() {
    fetch('../api/get_treatments.php') // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('treatmentTableBody'); // Ensure you have the correct ID
            tbody.innerHTML = ''; // Clear existing data

            if (data.length > 0) {
                data.forEach((treatment, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${treatment.name}</td>
                        <td>${treatment.prescription}</td>
                        <td>${treatment.patient_id}</td>
                        <td><a href="#" class="badge badge-success" onclick="viewTreatment(${treatment.id})"><i class="mdi mdi-eye"></i> View</a></td>
                    `;
                    tbody.appendChild(row);
                });
                console.log("Treatments found");
            } else {
                console.log("No treatments found");
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="5" class="text-center">No treatments found</td>`;
                tbody.appendChild(row);
            }
        })
        .catch(error => console.error('Error fetching treatment data:', error));
}



// Function to submit the bill form
function submitBillForm(e) {
    e.preventDefault(); // Prevent default form submission

    const billForm = document.getElementById('billForm');
    const formData = new FormData(billForm); // Collect form data from the form

    const hospitalId = formData.get('hospitalId');
  
    // Send the form data using fetch API (AJAX)
    fetch('../api/create_bill.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Bill created successfully!');
            closeBillForm(); // Close the form on success
            loadBillData(hospitalId); // Reload the bill data for the hospital
        } else {
            alert('Failed to create bill: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the bill.');
    });
}


// Fetch bills by hospitalId from the backend
function fetchBillsByHospital(hospitalId) {
    const url = `../api/get_hospital_bills.php?hospitalId=${hospitalId}`;

    // Return the fetched data so it can be used elsewhere
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching bills:', error);
            return [];
        });
}


// Function to update the bill table with fetched data
function updateBillTable(bills) {
    const tbody = document.getElementById('billTableBody');
    tbody.innerHTML = ''; // Clear existing data

    if (bills.length > 0) {
        bills.forEach((bill, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${bill.amount || 'N/A'}</td>
                <td>${bill.details || 'N/A'}</td>
                <td>${bill.patient_name || 'N/A'}</td> <!-- Display patient name here -->
                <td>
                    <a href="#" class="badge badge-success" onclick="viewBill(${bill.id})">
                        <i class="mdi mdi-eye" style="font-size: 15px;"></i> 
                    </a>
                    <a href="#" class="badge badge-success" onclick="editBill(${bill.id})">
                        <i class="mdi mdi-pencil" style="font-size: 15px;"></i> 
                    </a>
                    <a href="#" class="badge badge-success" onclick="deleteBill(${bill.id})">
                        <i class="mdi mdi-delete" style="color: red; font-size: 15px;"></i>
                    </a>
                </td>
            `;
            tbody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" class="text-center">No bills found</td>`;
        tbody.appendChild(row);
    }
}


function viewBill(billId) {
    fetch(`../api/get_bill_byId.php?bill_id=${billId}`) // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(bill => {
            // Populate the form fields with bill data
            document.getElementById('billAmount').value = bill.amount || 'N/A';
            document.getElementById('billDetails').value = bill.details || 'N/A';
            document.getElementById('patientId').value = bill.patient_id || 'N/A'; // Assuming this is a dropdown

            // Disable all input fields to prevent editing
            document.getElementById('billAmount').disabled = true;
            document.getElementById('billDetails').disabled = true;
            document.getElementById('patientId').disabled = true; // Disable patient ID dropdown

            // Update heading and button visibility for view mode
            document.querySelector('#billForm h2').textContent = 'View Bill';
            document.getElementById('billSubmitButton').style.display = 'none'; // Hide the submit button

            // Display the popup
            document.getElementById('billPopup').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching bill data:', error));
}

function editBill(billId) {
    fetch(`../api/get_bill_byId.php?bill_id=${billId}`) // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(bill => {
            // Populate the form fields with bill data
            document.getElementById('billAmount').value = bill.amount || 'N/A';
            document.getElementById('billDetails').value = bill.details || 'N/A';
            document.getElementById('patientId').value = bill.patient_id || 'N/A'; // Assuming this is a dropdown

            // Enable fields for editing
            document.getElementById('billAmount').disabled = false;
            document.getElementById('billDetails').disabled = false;
            document.getElementById('patientId').disabled = true; 

            // Update heading and button visibility for edit mode
            document.querySelector('#billForm h2').textContent = 'Edit Bill';
            document.getElementById('billSubmitButton').style.display = 'block';
            document.getElementById('billSubmitButton').textContent = 'Update';
            document.getElementById('billSubmitButton').onclick = (event) => updateBill(event, billId);

            // Display the popup
            document.getElementById('billPopup').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching bill data:', error));
}

function updateBill(event, billId) { // Accept billId as a parameter
    event.preventDefault(); // Prevent form from submitting normally

    // Collect form data
    const billData = {
        amount: document.getElementById('billAmount').value,
        details: document.getElementById('billDetails').value,
        patient_id: document.getElementById('patientId').value,
        hospitalId: document.getElementById('hospitalId').value

    };

    // Make an AJAX request to update the bill data using the billId in the URL
    fetch(`../api/update_bill.php/${billId}`, { // Use billId in the URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(billData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const hospitalId = document.getElementById('hospitalId').value;
            alert('Bill updated successfully.');
            loadBillData(hospitalId); // Function to reload the bill data table
            closeBillForm(); // Function to close the popup
        } else {
            alert('Error updating bill: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the bill.');
    });
}

function deleteBill(billId) {
    if (confirm("Are you sure you want to delete this bill?")) {
        fetch(`../api/delete_bill.php?bill_id=${billId}`, { // Adjust the path to the correct one
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const hospitalId = sessionStorage.getItem("hospitalId");
                alert('Bill deleted successfully.');
                loadBillData(hospitalId); // Reload the bill data to update the table
            } else {
                alert('Error deleting bill: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the bill.');
        });
    }
}


function showBillForm() {
    document.getElementById('billForm').reset(); // Clear the form fields for a new bill
    document.getElementById('hospitalId').value= sessionStorage.getItem("hospitalId");
    // Enable all input fields for creating a new bill
    document.getElementById('billAmount').disabled = false;
    document.getElementById('billDetails').disabled = false;
    document.getElementById('patientId').disabled = false; // Enable patient ID dropdown

    // Update the heading for new bill creation
    document.querySelector('#billForm h2').textContent = 'Create New Bill';
    document.getElementById('billSubmitButton').style.display = 'block'; 
    document.getElementById('billSubmitButton').textContent = 'Create';
    document.getElementById('billSubmitButton').onclick = (event) => submitBillForm(event);

    // Display the popup for bill form
    document.getElementById("billPopup").style.display = "flex";
}

function closeBillForm() {
    // Hide the bill form popup
    document.getElementById("billPopup").style.display = "none";
}


// Load bill data for the specified hospitalId
function loadBillData(hospitalId) {
    fetchBillsByHospital(hospitalId)
        .then(bills => {
            updateBillTable(bills);
        });
}





function fetchBills() {
    fetch('../api/get_bills.php') // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('billTableBody'); // Ensure you have the correct ID
            tbody.innerHTML = ''; // Clear existing data

            if (data.length > 0) {
                data.forEach((bill, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${bill.amount.toFixed(2)}</td>
                        <td>${bill.details}</td>
                        <td>${bill.patient_id}</td>
                        <td><a href="bill_view.php?bill_id=${bill.id}" class="badge badge-success"><i class="mdi mdi-eye"></i> View</a></td>
                    `;
                    tbody.appendChild(row);
                });
                console.log("Bills found");
            } else {
                console.log("No bills found");
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="5" class="text-center">No bills found</td>`;
                tbody.appendChild(row);
            }
        })
        .catch(error => console.error('Error fetching bill data:', error));
}


// Function to submit the consultation form
function submitConsultationForm(e) {
    e.preventDefault(); // Prevent default form submission

    const consultationForm = document.getElementById('consultationForm');
    const formData = new FormData(consultationForm); // Collect form data from the form

    // Convert patient_id, doctor_id, and hospital_id to integers (if needed)
  
    const hospitalId = formData.get('hospitalId');
    console.log(hospitalId);

    // Send the form data using fetch API (AJAX)
    fetch('../api/create_consultation.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Consultation created successfully!');
            closeConsultationForm(); // Close the form on success
            loadConsultationData(hospitalId); // Reload the consultation data for the hospital
        } else {
            alert('Failed to create consultation: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the consultation.');
    });
}


// Fetch consultations by hospitalId from the backend
function fetchConsultationsByHospital(hospitalId) {
    const url = `../api/get_hospital_consultations.php?hospitalId=${hospitalId}`;

    // Return the fetched data so it can be used elsewhere
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching consultations:', error);
            return [];
        });
}

// Function to update the consultation table with fetched data

function updateConsultationTable(consultations) {
    const tbody = document.getElementById('consultationTableBody');
    tbody.innerHTML = ''; // Clear existing data

    if (consultations.length > 0) {
        consultations.forEach((consultation, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${new Date(consultation.date).toLocaleDateString()}</td>
                <td>${consultation.patient_name || 'N/A'}</td> <!-- Display patient name here -->
                <td>${consultation.doctor_name || 'N/A'}</td> <!-- Display doctor name here -->
                <td>${consultation.details || 'N/A'}</td>
                <td>${consultation.report || 'N/A'}</td>
                <td>
                    <a href="#" class="badge badge-success" onclick="viewConsultation(${consultation.id})">
                        <i class="mdi mdi-eye" style="font-size: 15px;"></i>
                    </a>
                    <a href="#" class="badge badge-success" onclick="editConsultation(${consultation.id})">
                        <i class="mdi mdi-pencil" style="font-size: 15px;"></i> 
                    </a>
                    <a href="#" class="badge badge-success" onclick="deleteConsultation(${consultation.id})">
                        <i class="mdi mdi-delete" style="color: red; font-size: 15px;"></i> 
                    </a>
                </td>
            `;
            tbody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" class="text-center">No consultations found</td>`;
        tbody.appendChild(row);
    }
}


// Function to view consultation details
function viewConsultation(consultationId) {
    fetch(`../api/get_consultation_byId.php?consultation_id=${consultationId}`) // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(consultation => {
            // Populate the form fields with consultation data
            document.getElementById('consultationDate').value = new Date(consultation.date).toISOString().split('T')[0];
            document.getElementById('patientId').value = consultation.patient_id; // Assuming this is a dropdown
            document.getElementById('doctorId').value = consultation.doctor_id; // Assuming this is a dropdown
            document.getElementById('consultationDetails').value = consultation.details || 'N/A';
            document.getElementById('consultationReport').value = consultation.report || 'N/A';

            // Disable all input fields to prevent editing
            document.getElementById('consultationDate').disabled = true;
            document.getElementById('patientId').disabled = true; // Disable patient ID dropdown
            document.getElementById('doctorId').disabled = true; // Disable doctor ID dropdown
            document.getElementById('consultationDetails').disabled = true;
            document.getElementById('consultationReport').disabled = true;

            // Update heading and button visibility for view mode
            document.querySelector('#consultationForm h2').textContent = 'View Consultation';
            document.getElementById('consultationSubmitButton').style.display = 'none'; // Hide the submit button

            // Display the popup
            document.getElementById('consultationPopup').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching consultation data:', error));
}

// Function to edit consultation details
function editConsultation(consultationId) {
    fetch(`../api/get_consultation_byId.php?consultation_id=${consultationId}`) // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(consultation => {
            // Populate the form fields with consultation data
            document.getElementById('consultationDate').value = new Date(consultation.date).toISOString().split('T')[0];
            document.getElementById('patientId').value = consultation.patient_id; // Assuming this is a dropdown
            document.getElementById('doctorId').value = consultation.doctor_id; // Assuming this is a dropdown
            document.getElementById('consultationDetails').value = consultation.details || 'N/A';
            document.getElementById('consultationReport').value = consultation.report || 'N/A';

            // Enable fields for editing
            document.getElementById('consultationDate').disabled = false;
            document.getElementById('patientId').disabled = true; // Enable patient ID dropdown
            document.getElementById('doctorId').disabled = true; // Enable doctor ID dropdown
            document.getElementById('consultationDetails').disabled = false;
            document.getElementById('consultationReport').disabled = false;

            // Update heading and button visibility for edit mode
            document.querySelector('#consultationForm h2').textContent = 'Edit Consultation';
            document.getElementById('consultationSubmitButton').style.display = 'block';
            document.getElementById('consultationSubmitButton').textContent = 'Update';
            document.getElementById('consultationSubmitButton').onclick = (event) => updateConsultation(event, consultationId);

            // Display the popup
            document.getElementById('consultationPopup').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching consultation data:', error));
}

// Function to update consultation details
function updateConsultation(event, consultationId) { // Accept consultationId as a parameter
    event.preventDefault(); // Prevent form from submitting normally

    // Collect form data
    const consultationData = {
        date: document.getElementById('consultationDate').value,
        patient_id: document.getElementById('patientId').value,
        doctor_id: document.getElementById('doctorId').value, 
        details: document.getElementById('consultationDetails').value || 'N/A',
        report: document.getElementById('consultationReport').value || 'N/A',
        hospitalId: document.getElementById('hospitalId').value || 'N/A'

    };

    // Make an AJAX request to update the consultation data using the consultationId in the URL
    fetch(`../api/update_consultation.php/${consultationId}`, { // Use consultationId in the URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(consultationData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const hospitalId = document.getElementById('hospitalId').value;
            alert('Consultation updated successfully.');
            loadConsultationData(hospitalId); // Function to reload the consultation data table
            closeConsultationForm(); // Function to close the popup
        } else {
            alert('Error updating consultation: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the consultation.');
    });
}

function deleteConsultation(consultationId) {
    if (confirm("Are you sure you want to delete this consultation record?")) {
        fetch(`../api/delete_consultation.php?consultation_id=${consultationId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const hospitalId = sessionStorage.getItem("hospitalId");
                alert('Consultation record deleted successfully.');
                loadConsultationData(hospitalId); // Reload the consultation data to update the table
            } else {
                alert('Error deleting consultation record: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the consultation record.');
        });
    }
}

function showConsultationForm() {
    document.getElementById('consultationForm').reset(); // Clear the form fields for a new consultation
    document.getElementById('hospitalId').value= sessionStorage.getItem("hospitalId");
    // Enable all input fields for creating a new consultation
    document.getElementById('consultationDate').disabled = false;
    document.getElementById('patientId').disabled = false; // Enable patient ID dropdown
    document.getElementById('doctorId').disabled = false; // Enable doctor ID dropdown
    document.getElementById('consultationDetails').disabled = false;
    document.getElementById('consultationReport').disabled = false;

    // Update the heading for new consultation creation
    document.querySelector('#consultationForm h2').textContent = 'Create New Consultation';
    document.getElementById('consultationSubmitButton').style.display = 'block'; 
    document.getElementById('consultationSubmitButton').textContent = 'Create';
    document.getElementById('consultationSubmitButton').onclick = (event) => submitConsultationForm(event);

    // Display the popup for consultation form
    document.getElementById("consultationPopup").style.display = "flex";
}

function closeConsultationForm() {
    // Hide the consultation form popup
    document.getElementById("consultationPopup").style.display = "none";
}

// Load consultation data for the specified hospitalId
function loadConsultationData(hospitalId) {
    fetchConsultationsByHospital(hospitalId)
        .then(consultations => {
            updateConsultationTable(consultations);
        });
}

// Example function to load the initial consultation data
function initConsultationPage(hospitalId) {
    loadConsultationData(hospitalId);
}


//Fetch consultations

function fetchConsultations() {
    fetch('../api/get_consultations.php') // Adjust the path to your PHP file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('consultationTableBody'); // Ensure you have the correct ID
            tbody.innerHTML = ''; // Clear existing data

            if (data.length > 0) {
                data.forEach((consultation, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${consultation.date}</td>
                        <td>${consultation.patient_id}</td>
                        <td>${consultation.doctor_id}</td>
                        <td>${consultation.details}</td>
                        <td>${consultation.report}</td>
                        <td><a href="consultation_view.php?consultation_id=${consultation.id}" class="badge badge-success"><i class="mdi mdi-eye"></i> View</a></td>
                    `;
                    tbody.appendChild(row);
                });
                console.log("Consultations found");
            } else {
                console.log("No consultations found");
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="7" class="text-center">No consultations found</td>`;
                tbody.appendChild(row);
            }
        })
        .catch(error => console.error('Error fetching consultation data:', error));
}



// Submit the hospital form
function submitHospitalForm(e) {
    e.preventDefault(); // Prevent default form submission

    const hospitalForm = document.getElementById('hospitalForm');
    const formData = new FormData(hospitalForm); // Collect form data from the form

    // Send the form data using fetch API (AJAX)
    fetch('../api/create_hospital.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Hospital created successfully!');
            closeHospitalForm(); // Close the form on success
            fetchHospitals(sessionStorage.getItem("userId"));
        } else {
            alert('Failed to create hospital: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the hospital.');
    });
}

// Function to close the hospital form (placeholder)

function closeHospitalForm() {
    document.getElementById('hospitalPopup').style.display = 'none';
}



async function fetchAllHospitals() {
    try {
        console.log("Fetching hospitals..."); // Log to check if the function is called
        const response = await fetch('../api/get_hospitals.php'); // Adjust the path accordingly
        
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        console.log("Fetched data:", data); // Log the fetched data for debugging

    

        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            return data.data;
        } 
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        alert('An error occurred while fetching hospitals: ' + error.message);
    }
}


async function fetchHospitals(managerId) {
    try {
        console.log("Fetching hospitals..."); // Log to check if the function is called
        const response = await fetch('../api/get_user_hospital.php?managerId=' + managerId); // Pass the managerId

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        console.log("Fetched data:", data); // Log the fetched data for debugging

        const hospitalListContainer = document.getElementById('hospitalListContainer');
        const createHospitalButton = document.getElementById('createHospitalButton');
       
        
        // Check if the container exists
        if (!hospitalListContainer) {
            console.error("Hospital list container not found");
            return;
        }

  

        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            // Create a table to display hospitals
            data.data.forEach(hospital => {
                sessionStorage.setItem("hospitalId",hospital.id);
                sessionStorage.setItem("hospitalName",hospital.name);
            });
            createHospitalButton.style.display = 'none'; // Hide the button if hospitals exist
            hospitalListContainer.style.display = 'block';
        } else {
            // Show button if no hospitals exist
            createHospitalButton.style.display = 'block';
            hospitalListContainer.style.display = 'none';

        }
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        alert('An error occurred while fetching hospitals: ' + error.message);
    }
}


async function fetchHospitalById(hospitalId) {
    try {
        console.log("Fetching hospital..."); // Log to check if the function is called
        const response = await fetch(`../api/get_hospital_byId.php?hospitalId=${hospitalId}`); // Pass the hospitalId

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        console.log("Fetched hospital data:", data); // Log the fetched data for debugging

    
        if (data.success && data.data) {
           return data.json;
        } 
    } catch (error) {
        console.error('Error fetching hospital:', error);
        alert('An error occurred while fetching the hospital: ' + error.message);
    }
}


async function fetchUserAndHospital(managerId) {
    try {
        console.log("Fetching user and hospital details...");

        // Fetch user and hospital details from the API
        const response = await fetch('../api/get_user_and_hospital.php?managerId=' + managerId);

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        console.log("Fetched data:", data); // Log for debugging

        // Check if the API call was successful
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch details');
        }

        // Display User Details
        document.getElementById('username').textContent = data.user.username;
        document.getElementById('userEmail').textContent = data.user.email;

        // Display Hospital Details (since there's only one hospital for a user)
        const hospitalsContainer = document.getElementById('hospitals');
        hospitalsContainer.innerHTML = ''; // Clear the container before adding hospitals

        if (data.hospitals && data.hospitals.length > 0) {
            const hospital = data.hospitals[0];  // There is only one hospital for this user

            const hospitalElement = document.createElement('div');
            hospitalElement.className = 'hospital-item';
            hospitalElement.innerHTML = `
                <h4>${hospital.name}</h4>
                <p><strong>Contact:</strong> ${hospital.contact}</p>
                <p><strong>Address:</strong> ${hospital.address}, ${hospital.city}</p>
                <p><strong>Email:</strong> ${hospital.email}</p>
            `;
            hospitalsContainer.appendChild(hospitalElement);

            // Store hospital ID in sessionStorage for further use
            sessionStorage.setItem("hospitalId", hospital.id);
            sessionStorage.setItem("hospitalName",hospital.name);

            document.getElementById('createHospitalButton').style.display = 'none'; // Hide the button if hospital exists
        } else {
            // No hospital found for this user, show create button
            document.getElementById('createHospitalButton').style.display = 'block';
        }

    } catch (error) {
        console.error('Error fetching details:', error);
        alert('An error occurred while fetching details: ' + error.message);
    }
}


function userAccountView() {
    // Select the main container where the account details will be injected
    const containerMain = document.querySelector('.container-main');
    
    // Inject the HTML content for the "My Account" section
    containerMain.innerHTML = `
        <div class="user-container">
            <!-- User Section -->
            <section class="user-details">
                <h2>User Details</h2>
                <p><strong>Username:</strong> <span id="username"></span></p>
                <p><strong>Email:</strong> <span id="userEmail"></span></p>
            </section>

            <hr />

            <!-- Hospital Section -->
            <section class="hospital-details">
                <h2>Hospital Details</h2>
                <div id="hospitals"></div>

                <!-- If no hospital, show the create button -->
                <button id="createHospitalButton" style="display:none;">Create Hospital</button>
            </section>
        </div>
    `;

    const loggedInManagerId=sessionStorage.getItem("userId");
    fetchUserAndHospital(loggedInManagerId);
}


function loadHospitalsStats(hospitalId) {
    fetch(`../api/get_hospital_stats.php?hospital_id=${hospitalId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById(`patients_${hospitalId}`).textContent = `Patients: ${data.patient_count}`;
                document.getElementById(`doctors_${hospitalId}`).textContent = `Doctors: ${data.doctor_count}`;
                document.getElementById(`babies_${hospitalId}`).textContent = `Babies Born: ${data.baby_count}`;
            } else {
                console.error('Error fetching data:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}


async function viewHospitals() {
    const hospitals = await fetchAllHospitals(); // Fetch hospitals
    if (!hospitals) return; // Exit if no hospitals
   
    // Create HTML content for the hospitals
    const hospitalCards = hospitals.map(hospital => {
        return `
            <div class="hospital-card-item" onclick="selectHospital(${hospital.id}, '${hospital.name}')">
                <h3>${hospital.name}</h3>
                <p>${hospital.address}</p>
                <p>Contact: ${hospital.contact}</p>
                <div class="stat patients" id="patients_${hospital.id}">Patients: Loading...</div>
                <div class="stat doctors" id="doctors_${hospital.id}">Doctors: Loading...</div>
                <div class="stat babies" id="babies_${hospital.id}">Babies Born: Loading...</div>
            </div>
        `;
    }).join('');

    // Update the container-main with the generated HTML
    document.querySelector('.container-main').innerHTML = `
        <div class="hospital-card-container">
            ${hospitalCards}
        </div>
    `;

    // Load stats for each hospital once cards are displayed
    hospitals.forEach(hospital => {
        loadHospitalsStats(hospital.id);
    });
}


// // Function to set the hospital ID in session storage
// function setHospital(hospitalId) {
//     sessionStorage.setItem('hospitalId', hospitalId);
//     console.log(`Hospital ID ${hospitalId} set in session storage`);
    
// }

function selectHospital(hospitalId, hospitalName) {
    // Remove any existing hospital submenu
    sessionStorage.setItem('hospitalId', hospitalId);
    sessionStorage.setItem("hospitalName",hospitalName);
    console.log(`Hospital ID ${hospitalId} set in session storage`);
    loadHospitalName();
    const existingHospitalMenu = document.getElementById('hospitalSubMenu');
    if (existingHospitalMenu) {
        existingHospitalMenu.remove();
    }

    // Create the new sub-menu for the selected hospital
    const subMenuHtml = `
        <li id="hospitalSubMenu">
           <p style="cursor: pointer;">
                ${hospitalName}
            </p>
            <ul class="sub-menu"> <!-- Sub-menu for Hospitals -->
                <li><a href="dashboard.html" class="nav-link">Dashboard</a></li>
                <li><a href="doctors.html" class="nav-link">Doctors</a></li>
                <li><a href="patients.html" class="nav-link">Patients</a></li>
                <li><a href="babies.html" class="nav-link">Babies</a></li>
                <li><a href="vaccines.html" class="nav-link">Vaccines</a></li>
                <li><a href="treatments.html" class="nav-link">Treatments</a></li>
                <li><a href="bills.html" class="nav-link">Bills</a></li>
                <li><a href="consultations.html" class="nav-link">Consultations</a></li>
            </ul>
        </li>
    `;

    // Append the sub-menu after the hospitals list
    document.querySelector('.navbar ul').innerHTML += subMenuHtml;
}

function logoutUser() {
    // Clear session storage
    sessionStorage.clear();

    // Redirect to sign-out.html without adding to history
    window.location.replace('../sign_out.html');
}

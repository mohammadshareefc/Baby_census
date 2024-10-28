function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

// Check if hospital exists and show create button
// document.addEventListener('DOMContentLoaded', () => {
//     const hospitalExists = false; // Change this based on actual hospital data

//     const createHospitalSection = document.getElementById('createHospitalSection');
//     const hospitalFormSection = document.getElementById('hospitalFormSection');

//     if (!hospitalExists) {
//         createHospitalSection.classList.remove('hidden');
//     }
// });

function showHospitalOverview() {
    const container = document.getElementById('containerMain');
    container.innerHTML = `
        <div class="graph-section">
            <h3>Hospital Overview Graph</h3>
            <!-- Add graph or chart element here -->
        </div>

        <!-- Hospital Creation Section -->
        <div class="hospital-section">
            <!-- Display button to create a new hospital if none exists -->
            <button onclick="showHospitalForm()">Create New Hospital</button>
        </div>

        <!-- Hospital Creation Form (Hidden by default) -->
        <div id="hospitalPopup" class="popup" style="display: none;">
            <div class="popup-content">
                <span class="close-button" onclick="closeHospitalForm()">&times;</span>
                <form id="hospitalForm">
                    <h2>Create New Hospital</h2>
        
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="contact">Contact</label>
                        <input type="text" id="contact" name="contact" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="address">Address</label>
                        <textarea id="address" name="address" rows="3" required style="width: 65%;"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="city">City</label>
                        <input type="text" id="city" name="city" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="managerId">Manager ID</label>
                        <input type="number" id="managerId" name="managerId">
                    </div>
                    <div class="form-group">
                        <button onclick="closeHospitalForm()">Cancel</button>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

/// Show Hospital Creation Form
function showHospitalForm() {
    const hospitalPopup = document.getElementById('hospitalPopup');
    hospitalPopup.style.display = 'flex'; // Show the popup
}

// Close Hospital Creation Form
function closeHospitalForm() {
    const hospitalPopup = document.getElementById('hospitalPopup');
    hospitalPopup.style.display = 'none'; // Hide the popup
}

// Handle form submission
document.getElementById('hospitalForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Add your form submission logic here
    alert('Hospital created successfully!'); // Example alert
    closeHospitalForm(); // Close the form after submission
});


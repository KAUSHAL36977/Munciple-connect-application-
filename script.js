// Store complaints in localStorage
let complaints = JSON.parse(localStorage.getItem('complaints')) || [];

// DOM Elements
const complaintForm = document.getElementById('complaintForm');
const successAlert = document.getElementById('successAlert');
const complaintsContainer = document.getElementById('complaintsContainer');
const tabTriggers = document.querySelectorAll('.tab-trigger');
const tabContents = document.querySelectorAll('.tab-content');

// Tab Switching
tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        // Remove active class from all triggers and contents
        tabTriggers.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked trigger and corresponding content
        trigger.classList.add('active');
        document.getElementById(`${trigger.dataset.tab}-tab`).classList.add('active');
    });
});

// Form Submission
complaintForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(complaintForm);
    const complaintData = {
        id: Date.now(),
        status: 'pending',
        dateSubmitted: new Date().toLocaleDateString(),
    };

    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        complaintData[key] = value;
    }

    // Add new complaint
    complaints.push(complaintData);
    
    // Save to localStorage
    localStorage.setItem('complaints', JSON.stringify(complaints));

    // Reset form
    complaintForm.reset();

    // Show success message
    successAlert.style.display = 'block';
    setTimeout(() => {
        successAlert.style.display = 'none';
    }, 3000);

    // Update complaints display
    updateComplaintsDisplay();
});

// Update Complaints Display
function updateComplaintsDisplay() {
    if (complaints.length === 0) {
        complaintsContainer.innerHTML = '<div class="no-complaints">No complaints submitted yet</div>';
        return;
    }

    complaintsContainer.innerHTML = complaints.map(complaint => `
        <div class="complaint-item">
            <div class="complaint-header">
                <div>
                    <h3 class="complaint-title">
                        ${complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)} Issue
                    </h3>
                    <p>${complaint.description}</p>
                </div>
                <span class="complaint-status">${complaint.status}</span>
            </div>
            <div class="complaint-date">
                Submitted on: ${complaint.dateSubmitted}
            </div>
        </div>
    `).join('');
}

// Initial complaints display
updateComplaintsDisplay();

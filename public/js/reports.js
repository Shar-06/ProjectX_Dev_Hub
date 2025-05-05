import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDScRQZhidNCpQiPRk0XnQaPF6SM6NPi1U",
    authDomain: "login-c94f8.firebaseapp.com",
    projectId: "login-c94f8",
    storageBucket: "login-c94f8.appspot.com",
    messagingSenderId: "277803117358",
    appId: "1:277803117358:web:6d2f387bff41859bf3e8bf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const maintenanceForm = document.getElementById('maintenance-form');
    const filterForm = document.getElementById('filter-form');
    const reportsList = document.getElementById('reports-list');
    const noReportsMessage = document.getElementById('no-reports-message');
    const signOutButton = document.getElementById('sign-out-button');
    const userNameElement = document.getElementById('user-name');
    
    // Format date for display
    function formatDateForDisplay(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Get facility name by ID
    function getFacilityNameById(id) {
        const facilities = {
            'soccer-field': 'Soccer Field',
            'swimming-pool': 'Swimming Pool',
            'basketball-court': 'Basketball Court',
            'gymnasium': 'Gymnasium'
        };
        return facilities[id] || 'Unknown Facility';
    }

    // Create a report card element
    function createReportCard(report) {
        const article = document.createElement('article');
        article.className = 'report-card';
        article.dataset.reportId = report.id;
        
        const statusClass = report.status.toLowerCase().replace(' ', '-');
        const urgencyClass = report.urgency || 'unknown';
        
        article.innerHTML = `
            <header>
                <h3>${getFacilityNameById(report.facility_id)}</h3>
                <p class="report-status ${statusClass}">${report.status}</p>
                <p class="report-urgency ${urgencyClass}">${urgencyClass} priority</p>
            </header>
            <section class="report-details">
                <p><strong>Reported:</strong> ${formatDateForDisplay(report.reported_at)}</p>
                <p><strong>Issue:</strong> ${report.issue_type}</p>
                <p><strong>Description:</strong> ${report.description}</p>
                ${report.status_update ? `<p><strong>Update:</strong> ${report.status_update}</p>` : ''}
            </section>
            ${report.status !== 'resolved' ? `
            <footer>
                <button class="update-button" data-action="in-progress">Mark In Progress</button>
                <button class="update-button" data-action="resolved">Mark Resolved</button>
            </footer>
            ` : ''}
        `;
        
        return article;
    }

    // Load maintenance reports
    async function loadMaintenanceReports(filters = {}) {
        try {
            noReportsMessage.textContent = 'Loading maintenance reports...';
            
            // Convert filters to query string
            const queryString = new URLSearchParams(filters).toString();
            const response = await fetch(`/api/v1/maintenance?${queryString}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch maintenance reports');
            }
            
            const result = await response.json();
            
            if (result.success && result.data && result.data.length > 0) {
                noReportsMessage.hidden = true;
                reportsList.innerHTML = '';
                
                result.data.forEach(report => {
                    const card = createReportCard(report);
                    reportsList.appendChild(card);
                    
                    // Add event listeners to update buttons
                    const updateButtons = card.querySelectorAll('.update-button');
                    updateButtons.forEach(button => {
                        button.addEventListener('click', () => updateReportStatus(report.id, button.dataset.action, card));
                    });
                });
            } else {
                noReportsMessage.textContent = 'No maintenance reports found.';
                noReportsMessage.hidden = false;
            }
        } catch (error) {
            console.error('Error loading maintenance reports:', error);
            noReportsMessage.textContent = 'Failed to load maintenance reports. Please try again later.';
            noReportsMessage.hidden = false;
        }
    }

    // Submit new maintenance report
    async function submitMaintenanceReport(reportData) {
        try {
            // Show loading state
            const submitButton = maintenanceForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            
            const response = await fetch('/api/v1/reports/updateStatus', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reportData)
            });
            
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Maintenance report submitted successfully!';
                maintenanceForm.appendChild(successMessage);
                
                // Remove success message after a few seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
                
                maintenanceForm.reset();
                loadMaintenanceReports(); // Refresh the reports list
            } else {
                throw new Error(result.message || 'Failed to submit report');
            }
        } catch (error) {
            console.error('Error submitting maintenance report:', error);
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = `Failed to submit maintenance report: ${error.message}`;
            maintenanceForm.appendChild(errorMessage);
            
            // Remove error message after a few seconds
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
        }
    }

    // Update report status
    async function updateReportStatus(reportId, action, cardElement) {
        try {
            const response = await fetch(`/api/v1/maintenance/${reportId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update report status');
            }
            
            const result = await response.json();
            
            if (result.success) {
                alert('Report status updated successfully!');
                loadMaintenanceReports(); // Refresh the reports list
            } else {
                throw new Error(result.message || 'Failed to update report');
            }
        } catch (error) {
            console.error('Error updating report status:', error);
            alert('Failed to update report status. Please try again later.');
        }
    }

    // Handle form submission
    if (maintenanceForm) {
        maintenanceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get current user from Firebase Auth
            const user = auth.currentUser;
            
            if (!user) {
                alert('You must be logged in to submit a report');
                return;
            }
            
            const facility = document.getElementById('facility').value;
            const description = document.getElementById('description').value.trim();
            
            const reportData = {
                facility: facility,
                description: description,
                resident: user.uid,
                status: 'not-started'
            };
            
            await submitMaintenanceReport(reportData);
        });
    }

    // Handle filter form submission
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(filterForm);
            const filters = {
                status: formData.get('status'),
                facility: formData.get('facility')
            };
            loadMaintenanceReports(filters);
        });
    }

    // Handle sign out
    if (signOutButton) {
        signOutButton.addEventListener('click', () => {
            signOut(auth).then(() => {
                window.location.href = '../index.html';
            }).catch((error) => {
                console.error('Sign out error:', error);
            });
        });
    }

    // Check auth state and load reports
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (userNameElement) {
                userNameElement.textContent = user.displayName || user.email;
            }
            loadMaintenanceReports();
        } else {
            window.location.href = '../index.html';
        }
    });
});
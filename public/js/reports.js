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

function createReportNotification(currentUserid, currentUsername){
    const currentTime = new Date().toTimeString().split(' ')[0];;
    const currentDate = new Date().toISOString().split('T')[0];
    const viewStatus = "unread";
    const notificationType = "report-created";
    const notificationMessage = "new maintenance report has been created";
    
    fetch(`/api/v1/notifications/post-notification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ date:currentDate,timeslot:currentTime,status:viewStatus,message:notificationMessage,userid:currentUserid,type:notificationType,username:currentUsername}),
        })
        .then((response) => {
            
             if (!response.ok) throw new Error("Failed to create a facility issue report created notification");
                return response.json();
        })
        .then(() => {
        })
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Updated to match HTML structure
    const reportForm = document.getElementById('report-form');
    const filterForm = document.getElementById('filter-form');
    const reportsTableBody = document.getElementById('reports-tbody');
    const signOutButton = document.getElementById('sign-out-button');
    
    // Store all reports and filtered reports
    let allReports = [];
    let filteredReports = [];
    
    // Format date for display
    function formatDateForDisplay(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Get facility name by ID
    function getFacilityNameById(id) {
        const facilities = {
            '1': 'Gymnasium',
            '2': 'Swimming Pool', 
            '3': 'Soccer Field',
            '4': 'Basketball Court'
        };
        return facilities[id] || 'Unknown Facility';
    }

    // Function to create status badge HTML
    function createStatusBadge(status) {
        const statusText = status.replace('_', ' ');
        return `<span class="status-badge status-${status}">${statusText}</span>`;
    }

    // Function to render reports table
    function renderReportsTable(reports) {
        const tbody = document.getElementById('reports-tbody');
        
        if (reports.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">No reports found matching the selected criteria.</td></tr>';
            return;
        }

        tbody.innerHTML = reports.map(report => `
            <tr>
                <td>${report.id}</td>
                <td>${report.description}</td>
                <td>${report.facility}</td>
                <td>${createStatusBadge(report.status)}</td>
                <td>${ report.user || 'Unknown'}</td>
            </tr>
        `).join('');
    }

    // Function to apply filters
    function applyFilters() {
        const statusFilter = document.getElementById('status').value;
        
        filteredReports = allReports.filter(report => {
            if (statusFilter && report.status !== statusFilter) {
                return false;
            }
            return true;
        });
        
        renderReportsTable(filteredReports);
    }

    // Load maintenance reports from API
    async function loadMaintenanceReports(filters = {}) {
        try {
            // Show loading state
            const tbody = document.getElementById('reports-tbody');
            tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading maintenance reports...</td></tr>';
            
            // Convert filters to query string if needed
            const queryString = new URLSearchParams(filters).toString();
            const url = queryString ? `/api/v1/reports?${queryString}` : '/api/v1/reports';
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch maintenance reports');
            }
            
            const result = await response.json();
            
            if (result.success && result.data && result.data.length > 0) {
                allReports = result.data;
                filteredReports = [...allReports];
                renderReportsTable(filteredReports);
            } else {
                allReports = [];
                filteredReports = [];
                tbody.innerHTML = '<tr><td colspan="5" class="loading">No maintenance reports found.</td></tr>';
            }
        } catch (error) {
            console.error('Error loading maintenance reports:', error);
            const tbody = document.getElementById('reports-tbody');
            tbody.innerHTML = '<tr><td colspan="5" class="loading">Failed to load maintenance reports. Please try again later.</td></tr>';
        }
    }

    // Submit new maintenance report
    async function submitMaintenanceReport(reportData) {
        try {
            // Show loading state on button
            const submitButton = reportForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
                        
            const response = await fetch('/api/v1/reports/postReport', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reportData)
            });
            
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
             if(response.ok){
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        createReportNotification(user.uid,user.displayName);
                    } else {
                        // Redirect to login if not authenticated
                        window.location.href = '../html/LoginPage.html';
                    }
                });
             }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                // Show success message
                alert(`Report submitted successfully!`);
                
                // Reset form
                reportForm.reset();
                
                // Refresh the reports list
                await loadMaintenanceReports();
            } else {
                throw new Error(result.message || 'Failed to submit report');
            }
        } catch (error) {
            console.error('Error submitting maintenance report:', error);
            alert(`Failed to submit maintenance report: ${error.message}`);
        }
    }

    // Update report status (for staff/admin functionality)
    async function updateReportStatus(reportId, action) {
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
                await loadMaintenanceReports(); // Refresh the reports list
            } else {
                throw new Error(result.message || 'Failed to update report');
            }
        } catch (error) {
            console.error('Error updating report status:', error);
            alert('Failed to update report status. Please try again later.');
        }
    }

    // Handle report form submission
    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get current user from Firebase Auth
            const user = auth.currentUser;
            if (!user) {
                alert('You must be logged in to submit a report.');
                return;
            }
            
            // Get form data
            const formData = new FormData(reportForm);
            const facility = formData.get('facility');
            const description = formData.get('description')?.trim();
            
            // Validate required fields
            if (!facility || !description) {
                alert('Please fill in all required fields.');
                return;
            }
            
            const reportData = {
                facility_id: facility,
                description: description,
                resident_id: user.uid
            };
            
            await submitMaintenanceReport(reportData);
        });
    }

    // Handle filter form submission
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            applyFilters();
        });
    }

    // Handle staff feedback form submission (if present)
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(feedbackForm);
            const reportId = formData.get('report_id');
            const status = formData.get('status');
            
            if (reportId && status) {
                await updateReportStatus(reportId, status);
                feedbackForm.reset();
            } else {
                alert('Please select a report and status.');
            }
        });
    }

    // Handle sign out
    if (signOutButton) {
        signOutButton.addEventListener('click', async () => {
            try {
                await signOut(auth);
                 //clear session data
                localStorage.clear();
                sessionStorage.clear();
                document.cookie.split(";").forEach(cookie => {
                    document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
                window.location.href = '../html/LoginPage.html';
            } catch (error) {
                console.error('Sign out error:', error);
                alert('Failed to sign out. Please try again.');
            }
        });
    }

    // Check auth state and initialize
    onAuthStateChanged(auth, (user) => {
        if (user) {
    
            loadMaintenanceReports();
        } else {
            // Redirect to login if not authenticated
            window.location.href = '../html/LoginPage.html';
        }
    });

    // Initialize filters on page load
    document.getElementById('status').addEventListener('change', applyFilters);
});
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDScRQZhidNCpQiPRk0XnQaPF6SM6NPi1U",
    authDomain: "login-c94f8.firebaseapp.com",
    projectId: "login-c94f8",
    storageBucket: "login-c94f8.firebasestorage.app",
    messagingSenderId: "277803117358",
    appId: "1:277803117358:web:6d2f387bff41859bf3e8bf"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//Update report notification
function createUpdateReportNotification(currentUserid, currentUsername){
    const currentTime = new Date().toTimeString().split(' ')[0];;
    const currentDate = new Date().toISOString().split('T')[0];
    const viewStatus = "unread";
    const notificationType = "report-updated";
    const notificationMessage = "maintenance report status has been updated";
    
    fetch(`/api/v1/notifications/post-notification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ date:currentDate,timeslot:currentTime,status:viewStatus,message:notificationMessage,userid:currentUserid,type:notificationType,username:currentUsername}),
        })
        .then((response) => {
             if (!response.ok) throw new Error("Failed to create a maintenance report updated notification");
                return response.json();
        })
        .then(() => {
        })
}
//Load maintenance reports into the table
async function loadIntoTable(url, table, currentStaffId, currentStaffUsername) {
    const tableHead = table.querySelector("thead");
    const tableBody = table.querySelector("tbody");
    tableHead.innerHTML = '';
    tableBody.innerHTML = ''; // Clear existing content
    
    //use the provided URL to fetch data 
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer your-token-here' // Add if needed
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        
        const data = await response.json();
        const maintenanceReports = data.data || data;
        
        // Create header row
        const headerRow = document.createElement("tr");
        const headers = ["ID", "Brief Description", "Facility", "Logged By", "Status", "Actions"];
        headers.forEach(headerText => {
            const header = document.createElement("th");
            header.textContent = headerText;
            headerRow.appendChild(header);
        });
        tableHead.appendChild(headerRow);
        
        // Populate table with maintenance reports
        maintenanceReports.forEach(maintenanceReport => {
            const rowElement = document.createElement("tr");
            
            // ID
            const idCell = document.createElement("td");
            idCell.textContent = maintenanceReport.id;
            rowElement.appendChild(idCell);
            
            // Description
            const descCell = document.createElement("td");
            descCell.textContent = maintenanceReport.description;
            rowElement.appendChild(descCell);
            
            // Facility
            const facilityCell = document.createElement("td");
            facilityCell.textContent = maintenanceReport.facility;
            rowElement.appendChild(facilityCell);
            
            // Logged By
            const loggedByCell = document.createElement("td");
            loggedByCell.textContent = maintenanceReport.user;
            rowElement.appendChild(loggedByCell);
            
            // Current Status (display only)
            const statusDisplayCell = document.createElement("td");
            const currentStatus = maintenanceReport.status.toLowerCase().replace(' ', '-');
            const statusBadge = document.createElement("span");
            statusBadge.className = `status-badge ${currentStatus}`;
            statusBadge.textContent = maintenanceReport.status;
            statusDisplayCell.appendChild(statusBadge);
            rowElement.appendChild(statusDisplayCell);
            
            // Actions Cell with Status Dropdown
            const actionsCell = document.createElement("td");
            
            // Status Dropdown
            const statusSelect = document.createElement("select");
            statusSelect.className = "status-select";
            
            const statusOptions = [
                { value: 'not_started', label: 'Not Started' },
                { value: 'ongoing', label: 'Ongoing' },
                { value: 'completed', label: 'Completed' }
            ];
            
            statusOptions.forEach(option => {
                const optElement = document.createElement("option");
                optElement.value = option.value;
                optElement.textContent = option.label;
                if (option.value === currentStatus) {
                    optElement.selected = true;
                }
                statusSelect.appendChild(optElement);
            });
            
            // Update button
            const updateButton = document.createElement("button");
            updateButton.className = "update-btn";
            updateButton.textContent = "Update";
            updateButton.disabled = true; // Disabled until status changes
            
            // Enable update button when status changes
            statusSelect.addEventListener("change", () => {
                updateButton.disabled = statusSelect.value === currentStatus;
            });
            
            // Handle status update
            updateButton.addEventListener("click", async () => {
                const newStatus = statusSelect.value;
                const maintenanceReportId = maintenanceReport.id;
                try {
                    const updateResponse = await fetch(`/api/v1/reports/updateStatus/${maintenanceReportId}/${newStatus}/${currentStaffId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            // 'Authorization': 'Bearer your-token-here'
                        }
                    });
                    
                    if (!updateResponse.ok) {
                        throw new Error('Failed to update status');
                    }
                    
                    // Update the display
                    statusBadge.textContent = newStatus.replace('-', ' ');
                    statusBadge.className = `status-badge ${newStatus}`;
                    updateButton.disabled = true;
                    
                    // Show success notification
                    showNotification("Status updated successfully!", "success");
                    createUpdateReportNotification(currentStaffId,currentStaffUsername);
                    
                } catch (error) {
                    console.error("Error updating status:", error);
                    showNotification("Failed to update status", "error");
                    statusSelect.value = currentStatus; // Revert to original value
                    updateButton.disabled = true;
                }
            });
            
            actionsCell.appendChild(statusSelect);
            actionsCell.appendChild(updateButton);
            rowElement.appendChild(actionsCell);
            
            tableBody.appendChild(rowElement);
        });
        
        // Show error notification    
    } catch (error) {
        console.error("Error fetching data:", error);
        showNotification("Failed to load data", "error");
        
        const errorRow = document.createElement("tr");
        const errorCell = document.createElement("td");
        errorCell.colSpan = 6; // Fixed to match number of columns
        errorCell.textContent = "Failed to load data. Please try again later.";
        errorCell.style.color = "red";
        errorCell.style.textAlign = "center";
        errorRow.appendChild(errorCell);
        tableBody.appendChild(errorRow);
    }
}
// Show sucess/failure notification 
function showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.display = "block";
    notification.style.backgroundColor = type === "success" ? "#4CAF50" : "#f44336";
    
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            const email = user.email;
            const displayName = user.displayName;

            const currentStaffUsername = displayName;
            const currentStaffId = uid;
            loadIntoTable("/api/v1/reports/", document.getElementById("issuesTableBody"), currentStaffId,currentStaffUsername);
            // ...
        } else {
            // User is signed out
            // ...
        }
        });

    const signOutButton = document.getElementById('sign-out-button');
    signOutButton.addEventListener('click', () => {
            signOut(auth).then(() => {
                 //clear session data
                localStorage.clear();
                sessionStorage.clear();
                document.cookie.split(";").forEach(cookie => {
                    document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
                // Sign-out successful
                window.location.href = '../html/LoginPage.html'; // Redirect to home page
            }).catch((error) => {
                // An error happened
                console.error('Sign out error:', error);
                alert('Failed to sign out. Please try again.');
            });
    });
});
async function loadIntoTable(url, table) {
    const tableHead = table.querySelector("thead");
    const tableBody = table.querySelector("tbody");
    tableHead.innerHTML = '';
    tableBody.innerHTML = ''; // Clear existing content
    
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
            facilityCell.textContent = maintenanceReport.facility_id;
            rowElement.appendChild(facilityCell);
            
            // Logged By
            const loggedByCell = document.createElement("td");
            loggedByCell.textContent = maintenanceReport.resident_id;
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
                { value: 'not-started', label: 'Not Started' },
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
                    const updateResponse = await fetch(`/api/v1/reports/updateStatus/${maintenanceReportId}/${newStatus}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            // 'Authorization': 'Bearer your-token-here'
                        },
                        body: JSON.stringify({ status: newStatus })
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
    loadIntoTable("/api/v1/reports/", document.getElementById("issuesTableBody"));
    
    // Tab navigation functionality
    const maintenanceBtn = document.getElementById("maintenanceBtn");
    const trendsBtn = document.getElementById("trendsBtn");
    const maintenanceSection = document.getElementById("maintenanceSection");
    const trendsSection = document.getElementById("trendsSection");
    
    maintenanceBtn.addEventListener('click', () => {
        maintenanceBtn.classList.add('active');
        trendsBtn.classList.remove('active');
        maintenanceSection.classList.add('active');
        trendsSection.classList.remove('active');
    });
    
    trendsBtn.addEventListener('click', () => {
        trendsBtn.classList.add('active');
        maintenanceBtn.classList.remove('active');
        trendsSection.classList.add('active');
        maintenanceSection.classList.remove('active');
    });
});
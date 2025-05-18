let counterSoccer = 0;
let counterBasketball = 0;
let counterTennis = 0;
let counterSwimming = 0;
let counterOpen = 0;
let counterClosed = 0;  
let counterInProgress = 0;
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
            const facilityCheck = maintenanceReport.facility_id;
            // Update counters based on facility
            if (facilityCheck === "1") {
                counterSoccer++;
            }
            else if (facilityCheck === "2") {
                counterBasketball++;
            }       
            else if (facilityCheck === "3") {
                counterTennis++;
            }
            else if (facilityCheck === "4") {
                counterSwimming++;
            }
            rowElement.appendChild(facilityCell);
            
            // Logged By
            const loggedByCell = document.createElement("td");
            loggedByCell.textContent = maintenanceReport.resident_id;
            rowElement.appendChild(loggedByCell);
            
            // Current Status (display only)
            const statusDisplayCell = document.createElement("td");
            const currentStatus = maintenanceReport.status.toLowerCase().replace(' ', '-');
            // Update counters based on status
            if (currentStatus === "not-started") {
                counterOpen++;}
            else if (currentStatus === "completed") {
                counterClosed++;
            }
            else if (currentStatus === "in-progress") { 
                counterInProgress++;
            }
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
    updateIssuesChart(counterSoccer, counterBasketball, counterSwimming, counterTennis);
    updateStatusChart(counterOpen, counterClosed, counterInProgress);
}

function updateStatusChart(open, closed, inProgress) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    
    // Check if chart already exists and destroy it
    
    const chartData = {
        labels: ['Open', 'Closed', 'In Progress'],
        datasets: [{
            data: [open, closed, inProgress],
            backgroundColor: [
                'hsla(0, 85.00%, 49.80%, 0.70)',
                'hsla(130, 88.80%, 31.40%, 0.70)',
                'rgba(86, 187, 255, 0.7)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1
        }]
    };
    
    window.statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
        const legendContainer = document.getElementById('chartLegend2');
            legendContainer.innerHTML = ''; // Clear existing legend
            
            chartData.labels.forEach((label, index) => {
                const legendItem = document.createElement('li');
                legendItem.innerHTML = `
                    <span class="legend-color" style="background-color: ${chartData.datasets[0].backgroundColor[index]};"></span>
                    <span class="legend-label">${label}</span>
                    <span class="legend-value">${chartData.datasets[0].data[index]}</span>
                `;
                legendContainer.appendChild(legendItem);
    });
}
function updateIssuesChart(soccer, basketball, swimming, tennis) {
    const ctx = document.getElementById('usageChart').getContext('2d');
    
    // Check if chart already exists and destroy it

    
    const chartData = {
        labels: ['Soccer field', 'Basketball', 'Swimming pool', 'Tennis'],
        datasets: [{
            data: [soccer, basketball, swimming, tennis],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1
        }]
    };
    
    window.usageChart = new Chart(ctx, {
        type: 'bar',    
        data: chartData,
        options: {responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
    const legendContainer = document.getElementById('chartLegend');
    legendContainer.innerHTML = ''; // Clear existing legend
    
    chartData.labels.forEach((label, index) => {
        const legendItem = document.createElement('li');
        legendItem.innerHTML = `
            <span class="legend-color" style="background-color: ${chartData.datasets[0].backgroundColor[index]};"></span>
            <span class="legend-label">${label}</span>
            <span class="legend-value">${chartData.datasets[0].data[index]}</span>
        `;
        legendContainer.appendChild(legendItem);
    });
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
function setupTabNavigation() {
    const tabs = [
        {
            button: document.getElementById('maintenanceBtn'),
            section: document.getElementById('maintenanceSection')
        },
        {
            button: document.getElementById('trendsBtn'),
            section: document.getElementById('trendsSection')
        },
        {
            button: document.getElementById('statusBtn'),
            section: document.getElementById('statusSection')
        }
    ];

    // Function to switch tabs
    function switchTab(activeTab) {
        tabs.forEach(tab => {
            const isActive = tab === activeTab;
            tab.button.classList.toggle('active', isActive);
            tab.section.classList.toggle('active', isActive);
            
            // Force display style for sections
            tab.section.style.display = isActive ? 'block' : 'none';
        });
    }

    // Add click event to each tab button
    tabs.forEach(tab => {
        tab.button.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(tab);
        });
    });

    // Activate the first tab by default
    if (tabs.length > 0) {
        switchTab(tabs[0]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupTabNavigation();
    loadIntoTable("/api/v1/reports/", document.getElementById("issuesTableBody"));
});
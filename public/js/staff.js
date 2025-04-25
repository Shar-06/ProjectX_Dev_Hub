let maintenanceIssues = [
    {
        id: 1,
        brief: "Broken hoop",   
        facility: "Basketball Court",
        loggedBy: "Sharlene Moetjie",
        date: "2027-04-10",
        status: "ongoing"
    },
    {
        id: 2,
        brief: "Water leak in changing rooms",
        facility: "Swimming Pool",
        loggedBy: "William Shakespeare",
        date: "1996-04-15",
        status: "not-started"
    },
    {
        id: 3,
        brief: "Damaged balance beam",
        facility: "Gymnasium",
        loggedBy: "Tasha Cobbs",
        date: "2025-04-05",
        status: "completed"
    },
];

// Sample data for usage trends
const usageData = [
    { sport: "Basketball", percentage: 15 },
    { sport: "Soccer", percentage: 40 },
    { sport: "Gymnasium", percentage: 20 },
    { sport: "Swimming", percentage: 25 }
];

// Colors for pie chart
const chartColors = ["#B31E1A", "#E64525", "#0E2A55", "#8B0000"];


document.addEventListener("DOMContentLoaded", function() {
    const maintenanceBtn = document.getElementById("maintenanceBtn");
    const trendsBtn = document.getElementById("trendsBtn");
    
    const maintenanceSection = document.getElementById("maintenanceSection");
    const trendsSection = document.getElementById("trendsSection");
    
    maintenanceBtn.addEventListener("click", function() {
        maintenanceBtn.classList.add("active");
        trendsBtn.classList.remove("active");
        
        maintenanceSection.classList.add("active");
        trendsSection.classList.remove("active");
    });
    
    trendsBtn.addEventListener("click", function() {
        trendsBtn.classList.add("active");
        maintenanceBtn.classList.remove("active");
        
        trendsSection.classList.add("active");
        maintenanceSection.classList.remove("active");
        
        // Draw the chart
        drawPieChart();
    });
    
    // Populate maintenance issues table
    populateMaintenanceTable();
    
    // Draw the pie chart initially
    drawPieChart();
});

// Function to populate the maintenance issues table
function populateMaintenanceTable() {
    const tableBody = document.getElementById("issuesTableBody");
    tableBody.innerHTML = ''; // Clear existing content
    
    maintenanceIssues.forEach(issue => {
        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td>${issue.brief}</td>
            <td>${issue.facility}</td>
            <td>${issue.loggedBy}</td>
            <td>${formatDate(issue.date)}</td>
            <td>
                <select class="status-select" data-issue-id="${issue.id}" onchange="updateStatus(${issue.id}, this.value)">
                    <option value="not-started" ${issue.status === 'not-started' ? 'selected' : ''}>Not Started</option>
                    <option value="ongoing" ${issue.status === 'ongoing' ? 'selected' : ''}>Ongoing</option>
                    <option value="completed" ${issue.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </td>
        `;
        
        tableBody.appendChild(row);
    });

    // Apply styling to status selects based on their values
    document.querySelectorAll('.status-select').forEach(select => {
        applyStatusSelectStyling(select);
        
        // Add event listener to update styling on change
        select.addEventListener('change', function() {
            applyStatusSelectStyling(this);
        });
    });
}

// Function to apply styling to status select elements
function applyStatusSelectStyling(select) {
    // Remove all status classes
    select.classList.remove('not-started', 'ongoing', 'completed');
    
    // Add the appropriate class
    select.classList.add(select.value);
}

// Function to update the status of a maintenance issue
function updateStatus(issueId, newStatus) {
    const issueIndex = maintenanceIssues.findIndex(issue => issue.id === issueId);
    
    if (issueIndex !== -1) {

        maintenanceIssues[issueIndex].status = newStatus;
        
        
        const select = document.querySelector(`.status-select[data-issue-id="${issueId}"]`);
        if (select) {
            applyStatusSelectStyling(select);
        }
        
        showNotification("Status updated successfully!");
    }
}

//  notification
function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.display = "block";
    
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}

// draw the pie chart
function drawPieChart() {
    const canvas = document.getElementById("usageChart");
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    let startAngle = 0;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // pie segments
    usageData.forEach((data, index) => {
        const endAngle = startAngle + (data.percentage / 100) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        ctx.fillStyle = chartColors[index];
        ctx.fill();
        
        startAngle = endAngle;
    });
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    
    createLegend();
}

// chart legend
function createLegend() {
    const legendContainer = document.getElementById("chartLegend");
    legendContainer.innerHTML = "";
    
    usageData.forEach((data, index) => {
        const legendItem = document.createElement("li");
        legendItem.className = "legend-item";
        
        const colorBox = document.createElement("span");
        colorBox.className = "legend-color";
        colorBox.style.backgroundColor = chartColors[index];
        
        const label = document.createElement("span");
        label.textContent = `${data.sport}: ${data.percentage}%`;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        
        legendContainer.appendChild(legendItem);
    });
}

// Function to format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
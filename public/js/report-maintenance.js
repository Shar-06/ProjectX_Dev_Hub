// fetch and display maintenance status data
function showStatus() {
    fetch(`/api/v1/maintenances/status`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const statusData = data.data;

        // Map data for chart labels and values
        const labels = statusData.map(item => item.status);
        const values = statusData.map(item => parseInt(item.count));

        // Call function to render donut chart
        renderStatusDonutChart(labels, values);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
// Function to render the donut chart using Chart.js
function renderStatusDonutChart(labels, values) {
    const ctx = document.getElementById('issueStatusChart').getContext('2d');

    // Destroy previous chart if it exists (prevents duplicates if function called multiple times)
    if (window.statusDonutChart) {
        window.statusDonutChart.destroy();
    }

    window.statusDonutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Maintenance Status',
                data: values,
                backgroundColor: [
                    '#36A2EB',
                    '#FF6384',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ],
                
            }]
        },
        options: {
            responsive: true,
            
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Maintenance Reports Status Overview',
                    font: {
                      size: 18
                    }
                }
            }
        }
    });
}
// Function to fetch and display issues by facility
function showIssuesByFacility() {
  fetch(`/api/v1/maintenances/issues-by-facility`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => {
      const usageComparison = data.data || data;

      // Extract unique dates
      const labels = [...new Set(
        usageComparison.map(d => new Date(d.created_date).toISOString().split('T')[0])
      )].sort();
      // Extract unique facility names
      const facilities = [...new Set(usageComparison.map(d => d.name))];

      // Build datasets per facility
      const datasets = facilities.map(facility => {
        const facilityData = labels.map(date => {
          const record = usageComparison.find(d =>
            d.name === facility && new Date(d.created_date).toISOString().split('T')[0] === date
          );
          return record ? Number(record.count) : 0;
        });
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        return {
          label: facility,
          data: facilityData,
          borderColor: color,
          backgroundColor: color,
          fill: true,
          tension: 0.3
        };
      });

      const ctx = document.getElementById('facilityIssuesChart').getContext('2d');
      if (window.facilityUsageChart) {
        window.facilityUsageChart.destroy();
      }
      window.facilityUsageChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Issues by Facility',
              font: {
                size: 18
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Issues Count' },
            }
          }
        }
      });
    })
    .catch(error => console.error('Error fetching usage trends:', error));
}
// Function to fetch and display staff performance leaderboard
function showStaffPerformance() {
  fetch(`/api/v1/maintenances/staff-leaderboard`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(json => {
    const data = json.data;
    const tbody = document.querySelector('#staffPerformanceTable tbody');
    tbody.innerHTML = ''; // clear any existing rows

    data.forEach(staff => {
      // parse the ratio into a number
      const ratio = parseFloat(staff.relative_to_grand_count);

      // decide performance bucket
      let performance;
      if (ratio >= 0.6) performance = 'high';
      else if (ratio >= 0.3) performance = 'medium';
      else performance = 'low';

      // capitalized label
      const perfText = performance.charAt(0).toUpperCase() + performance.slice(1);

      // build row
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${staff.name}</td>
        <td>${staff.completed_reports}</td>
        <td>${staff.average_resolution_time}</td>
        <td>
          <div class="performance-label">${perfText}</div>
          <meter class="stat-progress" min="0" max="100" value="${Math.round(ratio * 100)}"></meter>
        </td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(err => console.error('Error loading staff performance:', err));
}

// Function to fetch and display recent maintenance issues
function showRecentMaintenance() {
  fetch(`/api/v1/maintenances/recent`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(json => {
    const recentData = json.data;
    const tbody = document.querySelector('#recentIssuesTable tbody');
    tbody.innerHTML = ''; // clear existing rows

    // maps for display text
    const statusMap = {
      not_started: 'Not Started',
      ongoing: 'Ongoing',
      completed: 'Completed'
    };
    // map each status to a priority level
    const priorityMap = {
      not_started: 'high',
      ongoing: 'medium',
      completed: 'low'
    };
    const priorityText = {
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    };

    recentData.forEach(item => {
      // format date
      const dt = new Date(item.created_date);
      const formattedDate = dt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const statusKey = item.status;
      const statusLabel = statusMap[statusKey] || 'Unknown';
      const prioLevel = priorityMap[statusKey] || 'low';
      const prioLabel = priorityText[prioLevel];

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>
          <span class="status-pill status-${statusKey}">
            ${statusLabel}
          </span>
        </td>
        <td>${formattedDate}</td>
        <td>
          <span class="priority priority-${prioLevel}">
            ${prioLabel}
          </span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(err => console.error('Error loading recent maintenance:', err));
}
// Function to fetch and display average resolution time
function showAveResolutionTime() {
    fetch('/api/v1/maintenances/average-resolution-time',
         {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
    }
    })
    .then(response => response.json())
    .then(data => {
        const avgTime = data.data[0]?.average_resolution_time || '0';
        document.getElementById('avg-time-display').textContent = `${avgTime} days`;
    })
    .catch(error => console.error('Error fetching average resolution time:', error));

}
document.addEventListener('DOMContentLoaded', showRecentMaintenance);

// Initialize all functions when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    showStatus();
    showIssuesByFacility();
    showStaffPerformance();
    showRecentMaintenance();
    showAveResolutionTime();
});
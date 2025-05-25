 let facilityUsageChart;
 // Function to fetch and display the most popular facility
 function showPopularFacility(){
        fetch('/api/v1/usagetrends/popular-facility', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            const popularFacility = data.data[0];
            const percentageValue = parseFloat(popularFacility.percentage);

            document.getElementById('facilityName').innerHTML = popularFacility.name;
            document.getElementById('stat-bar').setAttribute('value', percentageValue);
            //document.getElementById('progress-indicator').style.width = popularFacility.percentage + '%';
            document.getElementById('usage-perc').innerHTML = percentageValue + '%';

        })
        .catch(error => console.error('Error fetching popular facility:', error));
}
// Function to fetch and display total hours and bookings
function showTotalHours(startDate, endDate){
       fetch(`/api/v1/usagetrends/total-hours/${startDate}/${endDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            const totalHours = data.data[0];
            const numOfHours = parseFloat(totalHours.total_hours);
            const totalNumberOfHours = parseFloat(totalHours.overall_hours);
            const percentageValue = ((numOfHours / totalNumberOfHours) * 100).toFixed(2);

            document.getElementById('numOfHours').innerHTML = numOfHours;
            document.getElementById('hoursProgressBar').setAttribute('value', percentageValue);
            document.getElementById('hoursCapacity').innerHTML = percentageValue + '% of capacity';
        })
        .catch(error => console.error('Error fetching total hours:', error));
}
// Function to fetch and display total bookings
function showTotalBookings(startDate, endDate){
       fetch(`/api/v1/usagetrends/total-bookings/${startDate}/${endDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            const totalBookings = data.data[0];
            const numOfBookings = parseFloat(totalBookings.total_bookings);
            const totalNumberOfBookings = parseFloat(totalBookings.overall_bookings);
            const percentageValue = parseFloat(((numOfBookings / totalNumberOfBookings) * 100).toFixed(2));

            document.getElementById('numOfBookings').innerHTML = numOfBookings;
            document.getElementById('bookingsProgressBar').setAttribute('value', percentageValue);
            document.getElementById('bookingCapacity').innerHTML = percentageValue + '% of capacity';
        })
        .catch(error => console.error('Error fetching total bookings:', error));
}
// Function to render the usage table
function renderUsageTable(labels, datasets, facilities) {
    let tableHTML = '<table border="1" cellpadding="5" cellspacing="0">';
    tableHTML += '<thead><tr><th>Date</th>';

    // Add facility names as headers
    facilities.forEach(facility => {
        tableHTML += `<th>${facility}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';

    // Add rows for each date
    labels.forEach((date, index) => {
        tableHTML += `<tr><td>${date}</td>`;
        datasets.forEach(dataset => {
            tableHTML += `<td>${dataset.data[index]}</td>`;
        });
        tableHTML += '</tr>';
    });

    tableHTML += '</tbody></table>';

    // Inject the table HTML into the page
    document.getElementById('tableContainer').innerHTML = tableHTML;
}
// Function to fetch and display usage by facility
function showUsageByFacility(startDate, endDate, facilityId){
    fetch(`/api/v1/usagetrends/usage/${startDate}/${endDate}/${facilityId}`,{
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
            usageComparison.map(d => new Date(d.date).toISOString().split('T')[0])
            )].sort();
            // Extract unique facility names
            const facilities = [...new Set(usageComparison.map(d => d.name))];
            // Build datasets per facility
            const datasets = facilities.map(facility => {
            const facilityData = labels.map(date => {
                const record = usageComparison.find(d => 
                d.name === facility && new Date(d.date).toISOString().split('T')[0] === date
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

            const ctx = document.getElementById('usageChart').getContext('2d');
            if (facilityUsageChart) {
                facilityUsageChart.destroy(); // Destroy the existing chart instance
            }
            facilityUsageChart = new Chart(ctx, {
                type: 'bar',
                data: {
                labels: labels,
                datasets: datasets
                },
                options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                },
                scales: {
                    y: { beginAtZero: true,
                        title: { display: true, text: 'Usage Count' },
                    }
                }
                }
            });
        })
        .catch(error => console.error('Error fetching usage trends:', error));
         renderUsageTable(labels, datasets, facilities);
}
// Function to show usage comparison for all facilities
function showUsageComparison(startDate, endDate){
    fetch(`/api/v1/usagetrends/usage-comparison/${startDate}/${endDate}`,{
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
            usageComparison.map(d => new Date(d.date).toISOString().split('T')[0])
            )].sort();
            // Extract unique facility names
            const facilities = [...new Set(usageComparison.map(d => d.name))];
            // Build datasets per facility
            const datasets = facilities.map(facility => {
            const facilityData = labels.map(date => {
                const record = usageComparison.find(d => 
                d.name === facility && new Date(d.date).toISOString().split('T')[0] === date
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

            const ctx = document.getElementById('usageChart').getContext('2d');
            if (facilityUsageChart) {
                facilityUsageChart.destroy(); // Destroy the existing chart instance
            }
            facilityUsageChart = new Chart(ctx, {
                type: 'bar',
                data: {
                labels: labels,
                datasets: datasets
                },
                options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                },
                scales: {
                    y: { beginAtZero: true,
                        title: { display: true, text: 'Usage Count' },
                    }
                }
            }
            });
            renderUsageTable(labels, datasets, facilities);
        })
        .catch(error => console.error('Error fetching usage trends:', error));
}

// Event listener for DOMContentLoaded to initialize the page
document.addEventListener("DOMContentLoaded", function () {
    showPopularFacility();

    const buttons = document.querySelectorAll('.facility-filter');
    const allFacilityBtn = document.getElementById('allFacilityBtn');
    const basketballBtn = document.getElementById('basketballBtn');
    const soccerBtn = document.getElementById('soccerBtn');
    const swimmingBtn = document.getElementById('swimmingBtn');
    const gymnasiumBtn = document.getElementById('gymnasiumBtn'); 
      
    buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove 'active' from all buttons
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;
                buttons.forEach(btn => btn.classList.remove('active'));
                
                // Add 'active' to the clicked button
                button.classList.add('active');
                if(allFacilityBtn.classList.contains('active')){
                    if(startDate && endDate){
                        showUsageComparison(startDate, endDate);
                    }
                    else{
                        alert('Please select a date range');
                    }
                    
                }
                else if(soccerBtn.classList.contains('active')){
                    if(startDate && endDate){
                        let facilityId = 3;
                        showUsageByFacility(startDate, endDate, facilityId); 
                    }
                    else{
                        alert('Please select a date range');
                    }
                }
                else if(basketballBtn.classList.contains('active')){
                    if(startDate && endDate){
                        let facilityId = 4;
                        showUsageByFacility(startDate, endDate, facilityId); 
                    }
                    else{
                        alert('Please select a date range');
                    }
                }
                else if(swimmingBtn.classList.contains('active')){
                    if(startDate && endDate){
                        let facilityId = 2;
                        showUsageByFacility(startDate, endDate, facilityId); 
                    }
                    else{
                        alert('Please select a date range');
                    }
                }
                else if(gymnasiumBtn.classList.contains('active')){
                    if(startDate && endDate){
                        let facilityId = 1;
                        showUsageByFacility(startDate, endDate, facilityId); 
                    }
                    else{
                        alert('Please select a date range');
                    }
                }
            });
        });

    document.getElementById('applyBtn').addEventListener('click', function () {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        showPopularFacility();
        showTotalBookings(startDate, endDate);
        showTotalHours(startDate, endDate);      
 
    });
    
});
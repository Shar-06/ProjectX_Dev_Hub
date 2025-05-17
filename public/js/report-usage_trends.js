 let facilityUsageChart;
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
            const percentageValue = (numOfHours / totalNumberOfHours) * 100

            document.getElementById('numOfHours').innerHTML = numOfHours;
            document.getElementById('hoursProgressBar').setAttribute('value', percentageValue);
            document.getElementById('hoursCapacity').innerHTML = percentageValue + '% of capacity';
        })
        .catch(error => console.error('Error fetching total hours:', error));
}

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
            const percentageValue = (numOfBookings / totalNumberOfBookings) * 100

            document.getElementById('numOfBookings').innerHTML = numOfBookings;
            document.getElementById('bookingsProgressBar').setAttribute('value', percentageValue);
            document.getElementById('bookingCapacity').innerHTML = percentageValue + '% of capacity';
        })
        .catch(error => console.error('Error fetching total bookings:', error));
}
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
            console.log('Usage Comparison Data:', usageComparison);

            // Extract unique dates
            const labels = [...new Set(
            usageComparison.map(d => new Date(d.date).toISOString().split('T')[0])
            )].sort();
            console.log('Labels:', labels);

            // Extract unique facility names
            const facilities = [...new Set(usageComparison.map(d => d.name))];
            console.log('Facilities:', facilities);

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
}
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
            console.log('Usage Comparison Data:', usageComparison);

            // Extract unique dates
            const labels = [...new Set(
            usageComparison.map(d => new Date(d.date).toISOString().split('T')[0])
            )].sort();
            console.log('Labels:', labels);

            // Extract unique facility names
            const facilities = [...new Set(usageComparison.map(d => d.name))];
            console.log('Facilities:', facilities);

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
}

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
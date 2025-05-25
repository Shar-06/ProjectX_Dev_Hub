//const moment = require("moment");

let usageDates = [];
let usageNames = [];
let usageCount = [];
let lineChartInstance = null;
let barChartInstance = null;
let startDatePicked,endDatePicked;
let label = "Booking Usage for this week";

let issuesdates = [];
let issueNames = [];
let issueCount = [];
let issuesLabel = "Issues from this weeks";

let recentIssuesDates = [];
let recentIssueNames = [];
let recentIssueCount = [];

//graph initialization

  const endInitial = moment();
  const startInitial = moment().subtract(1,'week');

  startDatePicked = startInitial.format('YYYY-MM-DD');
  endDatePicked = endInitial.format('YYYY-MM-DD');

document.addEventListener("DOMContentLoaded", async function () {
  await usage_charts(startDatePicked,endDatePicked);
  await issues_by_facility(startDatePicked,endDatePicked);
  await recent_maintenance_reports(startDatePicked,endDatePicked);
  await most_popular_facility(startDatePicked,endDatePicked);
});

// ===================================================================================================================== //

//most-popular-facility
const customRange = document.querySelector(".facilities");    
const datePicker = document.querySelector(".datePicker1");

customRange.addEventListener("change", function () {
    datePicker.innerHTML = "";

    if (this.value === "1"){

      const end = moment();
      const start = moment().subtract(1,'week');

      startDatePicked = start.format('YYYY-MM-DD');
      endDatePicked = end.format('YYYY-MM-DD');

      most_popular_facility(startDatePicked,endDatePicked);

    }

    if (this.value === "2"){
      
      const end = moment();
      const start = moment().subtract(1,'month');

      startDatePicked = start.format('YYYY-MM-DD');
      endDatePicked = end.format('YYYY-MM-DD');

      most_popular_facility(startDatePicked,endDatePicked);
    }

    if (this.value === "3") {
        const startDate = document.createElement("input");
        const endDate = document.createElement("input");
        const to = document.createElement("p");
        const apply = document.createElement("input");

        startDate.type = "date";
        startDate.className = "startDate";

        to.textContent = "to";

        endDate.type = "date";
        endDate.className = "endDate";

        apply.className = "apply";
        apply.type = "submit";
        apply.value = "Apply"; 

        datePicker.append(startDate, to, endDate, apply);

    //do the fetch for the dates here
    apply.addEventListener("click", async () => {
    startDatePicked = startDate.value;
    endDatePicked = endDate.value;

    most_popular_facility(startDatePicked,endDatePicked);
        });
    }
});

// ====================================================================================================================== //
//usage charts 
const timeRange = document.querySelector(".timeRange");
const datePicker2 =  document.querySelector(".datePicker2");
const usage_chart = document.querySelector(".usageCharts");
timeRange.addEventListener("change", function () {
   datePicker2.innerHTML = "";

   if (this.value === "1"){

      const end = moment();
      const start = moment().subtract(1,'week');

      startDatePicked = start.format('YYYY-MM-DD');
      endDatePicked = end.format('YYYY-MM-DD');
      label = "Booking for this past week";    
      //new function will go here
      usage_charts(startDatePicked,endDatePicked);
    }

    if (this.value === "2"){
      
      const end = moment();
      const start = moment().subtract(1,'month');
      label = "Booking for this past month";
      startDatePicked = start.format('YYYY-MM-DD');
      endDatePicked = end.format('YYYY-MM-DD');

      //new function will go here
      usage_charts(startDatePicked,endDatePicked);
      
    }

    if (this.value === "3") {
        const startDate = document.createElement("input");
        const endDate = document.createElement("input");
        const to = document.createElement("p");
        const apply = document.createElement("input");

        startDate.type = "date";
        startDate.className = "startDate";

        to.textContent = "to";

        endDate.type = "date";
        endDate.className = "endDate";

        apply.className = "apply";
        apply.type = "submit";
        apply.value = "Apply"; 

        datePicker2.append(startDate, to, endDate, apply);

    //do the fetch for the dates here
    apply.addEventListener("click", async () => {
    startDatePicked = startDate.value;
    endDatePicked = endDate.value;
    label = "Booking for this custom range";  
    //you will have to call the new function here
    usage_charts(startDatePicked,endDatePicked);
        });
    }

});

// ============================================================================================================== //

//usage charts by facility 

const facilitySelector = document.querySelector(".facilitySelector");

facilitySelector.addEventListener("change", function () {
   let  selectedFacility;

   if (this.value === "1"){
      usage_charts(startDatePicked,endDatePicked);
    }

   if (this.value === "2"){
      selectedFacility = "Gymnasium";
      usage_charts_byFacility(startDatePicked,endDatePicked,selectedFacility);
    }

    if (this.value === "3"){
      selectedFacility = "Swimming Pool";     
      usage_charts_byFacility(startDatePicked,endDatePicked,selectedFacility);
      
    }

    if (this.value === "4") {
    selectedFacility = "Soccer Field";
    usage_charts_byFacility(startDatePicked,endDatePicked,selectedFacility);
    }

    if (this.value === "5"){
      selectedFacility = "Basketball Court";
      usage_charts_byFacility(startDatePicked,endDatePicked,selectedFacility);
    }

});


//===============================================================================================================//
const issuesTimeRange = document.querySelector(".issuesTimeSelector")
const datePicker3 = document.querySelector(".datePicker3");

issuesTimeRange.addEventListener("change", function () {
   datePicker3.innerHTML = "";

   if (this.value === "1"){

      const end = moment();
      const start = moment().subtract(1,'week');

      startDatePicked = start.format('YYYY-MM-DD');
      endDatePicked = end.format('YYYY-MM-DD');
      issuesLabel = "Issues from this past week";    
      //new function will go here
      issues_by_facility(startDatePicked,endDatePicked);
    }

    if (this.value === "2"){
      
      const end = moment();
      const start = moment().subtract(1,'month');
      issuesLabel = "Issues from this past month";
      startDatePicked = start.format('YYYY-MM-DD');
      endDatePicked = end.format('YYYY-MM-DD');

      //new function will go here
      issues_by_facility(startDatePicked,endDatePicked);
      
    }

    if (this.value === "3") {
        const startDate = document.createElement("input");
        const endDate = document.createElement("input");
        const to = document.createElement("p");
        const apply = document.createElement("input");

        startDate.type = "date";
        startDate.className = "startDate";

        to.textContent = "to";

        endDate.type = "date";
        endDate.className = "endDate";

        apply.className = "apply";
        apply.type = "submit";
        apply.value = "Apply"; 

        datePicker3.append(startDate, to, endDate, apply);

    //do the fetch for the dates here
    apply.addEventListener("click", async () => {
    startDatePicked = startDate.value;
    endDatePicked = endDate.value;
    issuesLabel = "Issues from this custom range";  
    //you will have to call the new function here
    issues_by_facility(startDatePicked,endDatePicked);
        });
    }

});

//====================================================================================================================//

// recent maintenance issues //
const recentIssuesTimeRange = document.querySelector(".recentTimeSelector")
const datePicker4 = document.querySelector(".datePicker4");

recentIssuesTimeRange.addEventListener("change", function () {
   datePicker4.innerHTML = "";

   if (this.value === "1"){

      const end = moment();
      const start = moment().subtract(1,'week');

      startDatePicked = start.format('YYYY-MM-DD');
      endDatePicked = end.format('YYYY-MM-DD');
      issuesLabel = "Issues from this past week";    
      //new function will go here
      recent_maintenance_reports(startDatePicked,endDatePicked);
    }

    if (this.value === "2"){
      
      const end = moment();
      const start = moment().subtract(1,'month');
      issuesLabel = "Issues from this past month";
      startDatePicked = start.format('YYYY-MM-DD');
      endDatePicked = end.format('YYYY-MM-DD');

      //new function will go here
      recent_maintenance_reports(startDatePicked,endDatePicked);
      
    }

    if (this.value === "3") {
        const startDate = document.createElement("input");
        const endDate = document.createElement("input");
        const to = document.createElement("p");
        const apply = document.createElement("input");

        startDate.type = "date";
        startDate.className = "startDate";

        to.textContent = "to";

        endDate.type = "date";
        endDate.className = "endDate";

        apply.className = "apply";
        apply.type = "submit";
        apply.value = "Apply"; 

        datePicker4.append(startDate, to, endDate, apply);

    //do the fetch for the dates here
    apply.addEventListener("click", async () => {
    startDatePicked = startDate.value;
    endDatePicked = endDate.value;
    issuesLabel = "Issues from this custom range";  
    //you will have to call the new function here
    recent_maintenance_reports(startDatePicked,endDatePicked);
        });
    }

});


// recent maintenance issues by facility

const recentSelector = document.querySelector(".recentSelector");

recentSelector.addEventListener("change", function () {
   let  selectedFacility;

   //i want this to be 1
     if (this.value === "1"){
      recent_maintenance_reports(startDatePicked,endDatePicked);
    }

   if (this.value === "2"){
      selectedFacility = "Gymnasium";
      recent_maintenance_reports_byFacility(startDatePicked,endDatePicked,selectedFacility);
    }

    if (this.value === "3"){
      selectedFacility = "Swimming Pool";     
      recent_maintenance_reports_byFacility(startDatePicked,endDatePicked,selectedFacility);
      
    }

    if (this.value === "4") {
    selectedFacility = "Soccer Field";
    recent_maintenance_reports_byFacility(startDatePicked,endDatePicked,selectedFacility);
    }

    if (this.value === "5"){
      selectedFacility = "Basketball Court";
      recent_maintenance_reports_byFacility(startDatePicked,endDatePicked,selectedFacility);
    }

});

//===============================================================================================================//

//get most_popular facility
async function most_popular_facility(start_date, end_date) {
  const url = `/api/v1/reporting/most-popular-facility/${start_date}/${end_date}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const mostPopularName = json.data.name;
    const mostPopularCount = json.data.count;
    const facilityNameElement = document.querySelector(".facilityName h2");
    const trophyImage = document.querySelector(".trophyImage");
    const bookingsCount = document.querySelector(".bookingsCount");

    if (mostPopularName) {
      facilityNameElement.textContent = mostPopularName;
      trophyImage.src = "../images/trophy.jpg"
      bookingsCount.textContent = 'with ' + mostPopularCount + ' bookings';
    } else {
      facilityNameElement.textContent = "No popular facility found";
    }

  } catch (error) {
    console.error("Fetch error:", error.message);
    const facilityNameElement = document.querySelector(".facilityName h2");
    facilityNameElement.textContent = "Error loading facility";
  }
}


//get usage charts by time
async function usage_charts(start_date,end_date) {

    const url = `/api/v1/reporting/usage-chart/${start_date}/${end_date}`;
    try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const usageData = json.data;

    createChart(usageData);

  //  return json;
  } catch (error) {
    console.error(error.message);
  }
}

//get usage charts by time
async function usage_charts_byFacility(start_date,end_date,facility_id) {

    const url = `/api/v1/reporting/usage-chart-byFacility/${start_date}/${end_date}/${facility_id}`;
    try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const usageData = json.data;

    createChart(usageData);

  } catch (error) {
    console.error(error.message);
  }
}


//get issues per facility
async function issues_by_facility(start_date,end_date) {

    const url = `/api/v1/reporting/issues-by-facility/${start_date}/${end_date}`;
    try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const usageData = json.data;

    createBarChart(usageData);

  } catch (error) {
    console.error(error.message);
  }
}

// get recent issues using hours 

async function recent_maintenance_reports(start_date,end_date) {

    const url = `/api/v1/reporting/recent-issues/${start_date}/${end_date}`;
    try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const usageData = json.data;

    createTable(usageData);

  } catch (error) {
    console.error(error.message);
  }
}

// get recent issues by facility

async function recent_maintenance_reports_byFacility(start_date,end_date,facility_name) {

    const url = `/api/v1/reporting/recent-issues-by-facility/${start_date}/${end_date}/${facility_name}`;
    try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const usageData = json.data;
    createTable(usageData);

  } catch (error) {
    console.error(error.message);
  }
}
// ===================================================== //

function createTable(usageData){
 const recentIssuesBody = document.querySelector(".recentIssuesBody");
  
 recentIssuesDates.length = 0;
 recentIssueNames.length = 0;
 recentIssueCount.length = 0;

  recentIssuesBody.innerHTML = "";
  //const chartContainer = document.querySelector(".issuesBarChartSection");

  if (usageData.length === 0) {
    recentIssuesBody.innerHTML = '<p>No Data Found for the selected range.</p>';
    return;
  }

  for (let i = 0; i < usageData.length; i++) {
    recentIssuesDates.push(moment(usageData[i].date).format('MMMM-DD'));
    recentIssueNames.push(usageData[i].name);
    recentIssueCount.push(parseInt(usageData[i].count));
  }

  for (let k = 0; k < usageData.length; k++){
    var row = recentIssuesBody.insertRow(k);
    var nameCell = row.insertCell(0);
    var descriptionCell = row.insertCell(1);
    var dateCell = row.insertCell(2);
    var statusCell = row.insertCell(3);

    nameCell.textContent = usageData[k].name;
    descriptionCell.textContent = usageData[k].description;
    dateCell.textContent = moment(usageData[k].date).format('YYYY-MM-DD');
    statusCell.textContent = usageData[k].status;
  }

}

function createBarChart(usageData) {
  issuesdates.length = 0;
  issueNames.length = 0;
  issueCount.length = 0;

  
  const facilityColors = {
  "Gymnasium": "#008000",        
  "Swimming Pool": "#0000FF",     
  "Soccer Field": "#FFFF00",      
  "Basketball Court": "#FF0000"   
};


const facilities = ["Gymnasium", "Swimming Pool", "Soccer Field", "Basketball Court"];

  const chartContainer = document.querySelector(".issuesBarChartSection");

  if (usageData.length === 0) {
    chartContainer.innerHTML = '<p>No Data Found for the selected range.</p>';
    return;
  }

  for (let i = 0; i < usageData.length; i++) {
    issuesdates.push(moment(usageData[i].date).format('MMMM-DD'));
    issueNames.push(usageData[i].name);
    issueCount.push(parseInt(usageData[i].count));
  }

  chartContainer.innerHTML = '<canvas id="issuesChart"></canvas>';
  const ctx = document.getElementById('issuesChart').getContext('2d');

 const backgroundColors = usageData.map(entry => facilityColors[entry.name] || '#9E9E9E'); // fallback grey

  const data = {
  labels: issueNames,
  datasets: [{
    label: issuesLabel,
    data: issueCount,
    backgroundColor: backgroundColors,
    borderColor: backgroundColors,
    borderWidth: 1
  }]
};


 const config = {
  type: 'bar',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        display :false,
        position: 'top',
        labels: {
          font: {
            size: 16 // Legend font size
          }
        }
      },
      title: {
        display: true,
        text: 'Issues Chart',
        font: {
          size: 20 // Chart title font size
        }
      },
      tooltip: {
        bodyFont: {
          size: 14 // Tooltip body font
        },
        titleFont: {
          size: 16 // Tooltip title font
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14 // X-axis label size
          }
        },
        title: {
          display: true,
          text: 'Facility',
          font: {
            size: 16
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 14 // Y-axis label size
          }
        },
        title: {
          display: true,
          text: 'Issue Count',
          font: {
            size: 16
          }
        }
      }
    }
  }
};

  if (barChartInstance) {
    barChartInstance.destroy();
  }
  barChartInstance = new Chart(ctx, config);
}

function createChart(usageData) {
  usageDates.length = 0;
  usageNames.length = 0;
  usageCount.length = 0;

const chartContainer = document.querySelector(".lineChart");

  if (usageData.length === 0) {
    chartContainer.innerHTML = '<p>No Data Found for the selected range.</p>';
    return;
  }

  for (let i = 0; i < usageData.length; i++) {
    usageDates.push(moment(usageData[i].date).format('MMMM-DD'));
    usageNames.push(usageData[i].names);
    usageCount.push(parseInt(usageData[i].count));
  }

  chartContainer.innerHTML = '<canvas id="usageChart"></canvas>';
  const ctx = document.getElementById('usageChart').getContext('2d');

  const data = {
    labels: usageDates,
    datasets: [{
      label: label,
      data: usageCount,
      borderColor: 'blue',
      tension: 0.4
    }]
  };

  const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 16 // Legend text size
          }
        }
      },
      title: {
        display: true,
        text: 'Usage Chart',
        font: {
          size: 20 // Title text size
        }
      },
      tooltip: {
        bodyFont: {
          size: 14 // Tooltip body size
        },
        titleFont: {
          size: 16 // Tooltip title size
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14 // X-axis label size
          }
        },
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 16
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 14 // Y-axis label size
          }
        },
        title: {
          display: true,
          text: 'Usage Count',
          font: {
            size: 16
          }
        }
      }
    }
  }
};


  if (lineChartInstance) {
    lineChartInstance.destroy();
  }
  lineChartInstance = new Chart(ctx, config);
}

function isValidDateRange(start, end) {
  const startDate = moment(start);
  const endDate = moment(end);

  if (!startDate.isValid() || !endDate.isValid()) {
    alert("Please enter valid dates.");
    return false;
  }

  if (endDate.isBefore(startDate)) {
    alert("End date cannot be before start date.");
    return false;
  }

  const earliestAllowed = moment("2023-01-01"); // adjust as needed
  const now = moment();

  if (startDate.isBefore(earliestAllowed) || endDate.isAfter(now)) {
    alert("Date range is out of allowed bounds.");
    return false;
  }

  return true;
}



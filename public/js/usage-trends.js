document.addEventListener("DOMContentLoaded", () => {
    // Initial render
    renderChartAndSummary("all");

    // Facility button logic
    document.querySelectorAll("[data-facility]").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll("[data-facility]").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            const selectedFacility = button.dataset.facility;
            renderChartAndSummary(selectedFacility);
        });
    });

    // CSV/PDF export
    const csvBtn = document.getElementById("export-csv");
    const pdfBtn = document.getElementById("export-pdf");
    if (csvBtn && pdfBtn) {
        csvBtn.addEventListener("click", () => {
            const data = getCSVData();
            downloadCSV(data.chartData, `${data.facility}-report.csv`);
        });

        pdfBtn.addEventListener("click", async () => {
            const data = getCSVData();
            await downloadPDF(data.chartData, `${data.facility}-report.pdf`);
        });
    }
});

function getSelectedFacility() {
    const activeBtn = document.querySelector("[data-facility].active");
    return activeBtn ? activeBtn.dataset.facility : "all";
}

function renderChartAndSummary(facilityKey) {
    const { chartData, summary } = getMockData(facilityKey);
    updateChart(chartData);
    updateSummaryCards(summary);
}

function getMockData(key) {
    const data = {
        "Basketball Courts": [
            { month: "January", bookings: 120, hours: 300 },
            { month: "February", bookings: 150, hours: 400 },
            { month: "March", bookings: 180, hours: 500 }
        ],
        "Soccer Fields": [
            { month: "January", bookings: 100, hours: 250 },
            { month: "February", bookings: 130, hours: 350 },
            { month: "March", bookings: 90, hours: 240 }
        ],
        "Swimming Pool": [
            { month: "January", bookings: 80, hours: 200 },
            { month: "February", bookings: 95, hours: 230 },
            { month: "March", bookings: 110, hours: 280 }
        ],
        "Gymnasium": [
            { month: "January", bookings: 70, hours: 180 },
            { month: "February", bookings: 85, hours: 220 },
            { month: "March", bookings: 100, hours: 260 }
        ]
    };

    if (key === "all") {
        const chartData = [["Month", "Basketball Courts", "Soccer Fields", "Swimming Pool", "Gymnasium"]];
        const months = ["January", "February", "March"];
        for (let i = 0; i < months.length; i++) {
            chartData.push([
                months[i],
                data["Basketball Courts"][i].bookings,
                data["Soccer Fields"][i].bookings,
                data["Swimming Pool"][i].bookings,
                data["Gymnasium"][i].bookings
            ]);
        }
        return {
            chartData,
            summary: calculateCombinedSummary(data)
        };
    }

    const facilityMap = {
        basketball: "Basketball Courts",
        soccer: "Soccer Fields",
        swimming: "Swimming Pool",
        gym: "Gymnasium"
    };

    const facilityName = facilityMap[key];
    if (data[facilityName]) {
        const chartData = [["Month", "Bookings"]];
        data[facilityName].forEach(entry => {
            chartData.push([entry.month, entry.bookings]);
        });

        return {
            chartData,
            summary: calculateFacilitySummary(data[facilityName], facilityName)
        };
    }

    return { chartData: [], summary: {} };
}

function calculateCombinedSummary(data) {
    let totalBookings = 0;
    let totalHours = 0;
    const facilityTotals = {};

    for (const facility in data) {
        let bookings = 0;
        let hours = 0;
        data[facility].forEach(entry => {
            bookings += entry.bookings;
            hours += entry.hours;
        });
        facilityTotals[facility] = bookings;
        totalBookings += bookings;
        totalHours += hours;
    }

    const popularFacility = Object.entries(facilityTotals).sort((a, b) => b[1] - a[1])[0][0];

    return {
        totalBookings,
        totalHours,
        popularFacility
    };
}

function calculateFacilitySummary(entries, facility) {
    let totalBookings = 0;
    let totalHours = 0;
    entries.forEach(entry => {
        totalBookings += entry.bookings;
        totalHours += entry.hours;
    });

    return {
        totalBookings,
        totalHours,
        popularFacility: facility
    };
}

let chartInstance;
function updateChart(data) {
    const ctx = document.getElementById("facilityUsageChart").getContext("2d");

    if (chartInstance) chartInstance.destroy();

    const labels = data.slice(1).map(row => row[0]);
    const isGrouped = data[0].length > 2;

    const datasets = isGrouped
        ? data[0].slice(1).map((facility, i) => ({
            label: facility,
            data: data.slice(1).map(row => row[i + 1]),
            backgroundColor: ["#1976D2", "#388E3C", "#F57C00", "#7B1FA2"][i]
        }))
    : [{
            label: "Bookings",
            data: data.slice(1).map(row => row[1]),
            backgroundColor: "#1976D2"
        }];

    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                title: {
                    display: true,
                    text: "Facility Usage (Bookings)"
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function updateSummaryCards(summary) {
    const cards = document.querySelectorAll(".stat-card");
    if (!cards.length) return;

    cards[0].querySelector(".stat-value").textContent = summary.totalBookings;
    cards[1].querySelector(".stat-value").textContent = summary.totalHours;
    cards[2].querySelector(".stat-value").textContent = summary.popularFacility;
}

// CSV Export
function downloadCSV(data, filename) {
    const csv = data.map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// PDF Export
async function downloadPDF(data, filename) {
    const { jsPDF } = window.jspdf;
    const canvas = await html2canvas(document.getElementById("tab-summary"), { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = 190;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.addPage();

    pdf.setFontSize(14);
    pdf.text("Report Table Summary", 14, 20);

    const startY = 30;
    data.forEach((row, i) => {
        pdf.text(row.join("   "), 14, startY + i * 10);
    });

    pdf.save(filename);
}

// Exposed Functions for Parent Access
window.getCSVData = function () {
    const facility = getSelectedFacility();
    const { chartData } = getMockData(facility);
    return { facility, chartData };
};

window.getTableData = function () {
    const rows = Array.from(document.querySelectorAll("#data-table tbody tr"));
    const data = rows.map(row => Array.from(row.children).map(cell => cell.textContent));
    const headers = Array.from(document.querySelectorAll("#data-table thead th"))
        .map(th => th.textContent);
    return [headers, ...data];
};
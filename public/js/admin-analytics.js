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
    document.getElementById("export-csv").addEventListener("click", () => {
        const facility = getSelectedFacility();
        const { chartData } = getMockData(facility);
        downloadCSV(chartData, `${facility}-report.csv`);
    });

    document.getElementById("export-pdf").addEventListener("click", async () => {
        const facility = getSelectedFacility();
        // const { chartData } = getMockData(facility);
        // The getMockData no longer exist so the csv download should sort of extract data from the visuals (Idk - How would I go about filling the csv?)

        await downloadPDF(chartData, `${facility}-report.pdf`);
    });
});

function getSelectedFacility() {
    const activeBtn = document.querySelector("[data-facility].active");
    return activeBtn ? activeBtn.dataset.facility : "all";
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

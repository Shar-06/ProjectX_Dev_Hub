document.addEventListener('DOMContentLoaded', function () {
// Tab Switching Logic
const tabButtons = document.querySelectorAll('.tab-button');
const iframes = {
'usage-trends': document.getElementById('iframe-usage-trends'),
'maintenance': document.getElementById('iframe-maintenance'),
'custom': document.getElementById('iframe-custom')
};

tabButtons.forEach(button => {
button.addEventListener('click', () => {
    // Update tab button styles
    tabButtons.forEach(btn => {
    btn.classList.remove('active');
    btn.classList.add('inactive');
    });
    button.classList.add('active');
    button.classList.remove('inactive');

    // Show selected iframe, hide others
    const selectedTab = button.dataset.tab;
    for (const tab in iframes) {
    iframes[tab].classList.add('hidden');
    }
    iframes[selectedTab].classList.remove('hidden');
});
});

// CSV Export Logic
/*document.getElementById('export-csv').addEventListener('click', function () {
    try {
        const iframe = document.querySelector('.tab-iframe:not(.hidden)');
        if (!iframe) throw new Error('No visible iframe found.');

        // Access iframe's document
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (!iframeDoc) throw new Error('Cannot access iframe document.');

        // Select the table inside iframe by ID (adjust if different)
        const table = iframeDoc.querySelector('#data-table');
        if (!table) throw new Error('Table with ID "data-table" not found in iframe.');

        // Extract headers
        const headers = Array.from(table.querySelectorAll('thead th'))
            .map(th => th.textContent.trim());

        // Extract rows
        const rows = Array.from(table.querySelectorAll('tbody tr'))
            .map(tr => Array.from(tr.querySelectorAll('td'))
                .map(td => td.textContent.trim())
            );

        // Combine headers + rows
        const allRows = [headers, ...rows];

        // Convert to CSV string with proper escaping
        const csvContent = allRows.map(row => 
            row.map(cell => {
                if (cell == null) return '';
                const cellStr = String(cell);
                if (cellStr.includes('"')) {
                    return `"${cellStr.replace(/"/g, '""')}"`;
                } else if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('\r')) {
                    return `"${cellStr}"`;
                } else {
                    return cellStr;
                }
            }).join(',')
        ).join('\n');

        // Create blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'report.csv';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    } catch (error) {
        alert('CSV export failed while reading iframe table.');
        console.error(error);
    }
});*/



// PDF Export Logic
document.getElementById('export-pdf').addEventListener('click', async function () {
    const iframe = document.querySelector('.tab-iframe:not(.hidden)');
    const iframeWindow = iframe.contentWindow;
    const iframeDoc = iframe.contentDocument || iframeWindow.document;

    try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    const content = iframeDoc.body;

    // 1. Capture the visible layout
    const canvas = await html2canvas(content, { useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    const pageWidth = doc.internal.pageSize.getWidth();
    const ratio = canvas.width / canvas.height;
    const imgHeight = pageWidth / ratio;

    doc.addImage(imgData, 'PNG', 20, 20, pageWidth - 40, imgHeight);
    let y = imgHeight + 40;

    doc.save('report.pdf');
    } catch (err) {
    console.error(err);
    alert('PDF export failed. Ensure the iframe exposes getTableData().');
    }
});

});

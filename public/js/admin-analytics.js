import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDScRQZhidNCpQiPRk0XnQaPF6SM6NPi1U",
    authDomain: "login-c94f8.firebaseapp.com",
    projectId: "login-c94f8",
    storageBucket: "login-c94f8.firebasestorage.app",
    messagingSenderId: "277803117358",
    appId: "1:277803117358:web:6d2f387bff41859bf3e8bf"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
 const signOutButton = document.getElementById('sign-out-button');
    signOutButton.addEventListener('click', () => {
        signOut(auth).then(() => {
            //clear session data
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach(cookie => {
                document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            // Sign-out successful
            window.location.href = '../html/LoginPage.html'; // Redirect to home page
        }).catch((error) => {
            // An error happened
            console.error('Sign out error:', error);
            alert('Failed to sign out. Please try again.');
        });
    });

});

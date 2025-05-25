import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDScRQZhidNCpQiPRk0XnQaPF6SM6NPi1U",
    authDomain: "login-c94f8.firebaseapp.com",
    projectId: "login-c94f8",
    storageBucket: "login-c94f8.firebasestorage.app",
    messagingSenderId: "277803117358",
    appId: "1:277803117358:web:6d2f387bff41859bf3e8bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
document.addEventListener("DOMContentLoaded", () => {
    
    fetch('/api/v1/notifications/type/event', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const notifications = data.data || data;
        if(notifications.length != 0){
                    const notificationBookingsList = document.getElementById("notification-events-list");
        console.log(notificationBookingsList);

        notifications.forEach(notification => {
            const li = document.createElement("li");
            li.className = "notification";
            const dateObj = new Date(notification.date);

            // Format the date part
            const formattedDate = dateObj.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
            });

            // Final display string
            const displayTime = `${formattedDate} ${notification.timeslot}`;

            li.innerHTML = `
                <p>${notification.message}
                </p>
                <time>${displayTime}</time>
            `;
            notificationBookingsList.appendChild(li);
        });
        }
        else{
            const notificationBookingsList = document.getElementById("notification-events-list");
            console.log(notificationBookingsList);
            const li = document.createElement("li");
            li.className = "notification";
            li.innerHTML = `
                <p>No notifications available</p>
            `;
            notificationBookingsList.appendChild(li);
        }
    })
    .catch(error => {
       console.log("error while fetching notifications: "+ error)
    })

    fetch('/api/v1/notifications/type/report-created', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const notifications = data.data || data;
        if(notifications.length != 0){
            const notificationBookingsList = document.getElementById("notification-reports-list");
        notifications.forEach(notification => {
            const li = document.createElement("li");
            li.className = "notification";
            const dateObj = new Date(notification.date);

            // Format the date part
            const formattedDate = dateObj.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
            });

            // Final display string
            const displayTime = `${formattedDate} ${notification.timeslot}`;

            li.innerHTML = `
                <p>${notification.message} by user 
                <strong>${notification.username}</strong> 
                </p>
                <time>${displayTime}</time>
            `;
            notificationBookingsList.appendChild(li);
        });
        }
        else{
            const notificationBookingsList = document.getElementById("notification-reports-list");
            const li = document.createElement("li");
            li.className = "notification";
            li.innerHTML = `
                <p>No notifications available</p>
            `;
            notificationBookingsList.appendChild(li);
        }
    })
    .catch(error => {
       console.log("error while fetching notifications: "+ error)
    })
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
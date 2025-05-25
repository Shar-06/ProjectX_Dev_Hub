import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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


function createEventNotification(currentUserid, currentUsername){
    const currentTime = new Date().toTimeString().split(' ')[0];;
    const currentDate = new Date().toISOString().split('T')[0];
    const viewStatus = "unread";
    const notificationType = "event";
    const notificationMessage = "new event has been created";
    
    fetch(`/api/v1/notifications/post-notification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ date:currentDate,timeslot:currentTime,status:viewStatus,message:notificationMessage,userid:currentUserid,type:notificationType,username:currentUsername}),
        })
        .then((response) => {
             if (!response.ok) throw new Error("Failed to create an event created notification");
                return response.json();
        })
        .then(() => {
        })
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("eventForm");
    
    if (!form) {
        console.error("Event form not found.");
        return;
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
    
        const formData = new FormData();
        //formData.append("id", "11");
        formData.append("title", document.getElementById("eventTitle")?.value || "");
        formData.append("description", document.getElementById("description")?.value || "");
        formData.append("timeslot", document.getElementById("timeslot")?.value || "");
        formData.append("facility_id", document.getElementById("facility")?.value || "");
        formData.append("date", new Date(document.getElementById("eventDate")?.value).toISOString() || "");
        formData.append("host", document.getElementById("hostedBy")?.value || "");
    
        const imageInput = document.getElementById("imageurl");
        if (!imageInput || !imageInput.files.length) {
            alert("Please upload an image.");
            return;
        }
    
        formData.append("image", imageInput.files[0]);
    
        try {
            const response = await fetch('/api/v1/events/postEvent', {
                method: "POST",
                body: formData
            });
    
            if (response.ok) {

                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        createEventNotification(user.uid,user.displayName);
                        }
                     else{}
                    });

                const result = await response.json();
                alert("Event created successfully!");
                window.location.href = "admin-events.html";
            } else {
                const errorText = await response.text();
                alert("Failed to create event: " + errorText);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while creating the event.");
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

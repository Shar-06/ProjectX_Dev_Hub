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

document.addEventListener('DOMContentLoaded', async () => {
    const eventsContainer = document.querySelector('.events');

    try {
        const response = await fetch('/api/v1/events/');
        const result = await response.json();

        if (result.success) {
            result.data.forEach(event => {
                const card = document.createElement('article');
                card.classList.add('event-card');

                const image = document.createElement('img');
                image.src = event.imageurl;
                image.alt = 'Event cover image';
                image.classList.add('event-cover');

                const title = document.createElement('h3');
                title.textContent = event.title;

                const button = document.createElement('button');
                button.classList.add('event-details');
                button.textContent = 'Read More';
                button.addEventListener('click', () => showModal(event));

                card.appendChild(image);
                card.appendChild(title);
                card.appendChild(button);

                eventsContainer.appendChild(card);
            });
        } else {
            eventsContainer.textContent = 'Failed to load events.';
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        eventsContainer.textContent = 'An error occurred loading events.';
    }

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

function showModal(event) {
    const formattedDate = new Date(event.date).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    const modal = document.createElement('div');
    modal.classList.add('modal');

    modal.innerHTML = `
        <h2>${event.title}</h2>
        <img src="${event.imageurl}" alt="Event Image" height="200" width="300" class="modal-image">
        <div class="modal-details">
            <p><strong>Facility:</strong> ${getFacilityName(event.facility_id)}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${event.timeslot}</p>
            <p><strong>Host:</strong> ${event.host}</p>
            <p><strong>Description:</strong></p>
            <p>${event.description}</p>
        </div>
        <button class="close-modal">Close</button>
    `;

    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    document.querySelector('.close-modal').addEventListener('click', () => {
        modalOverlay.remove();
    });
}

function getFacilityName(facilityId) {
    const facilities = {
        1: 'Gymnasium',
        2: 'Swimming Pool',
        3: 'Soccer Field',
        4: 'Basketball Court'
    };
    return facilities[facilityId] || 'Unknown Facility';
}

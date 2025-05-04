// viewBookings.js - View sports facility bookings
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDScRQZhidNCpQiPRk0XnQaPF6SM6NPi1U",
    authDomain: "login-c94f8.firebaseapp.com",
    projectId: "login-c94f8",
    storageBucket: "login-c94f8.appspot.com",
    messagingSenderId: "277803117358",
    appId: "1:277803117358:web:6d2f387bff41859bf3e8bf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const bookingsList = document.getElementById('bookings-list');
    const noBookingsMessage = document.getElementById('no-bookings-message');
    const signOutButton = document.getElementById('sign-out-button');
    const userNameElement = document.getElementById('user-name');

    // Format date for display
    function formatDateForDisplay(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Format time slot for display
    function formatTimeSlotForDisplay(slot) {
        if (!slot) return 'N/A';
        
        // Handle both formats (just time range or full timestamp)
        const timePart = slot.includes(' ') ? slot.split(' ')[1] : slot;
        const [start, end] = timePart.split('-');
        
        function formatSingleTime(time) {
            if (!time) return '';
            const [hours, minutes] = time.split(':');
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            return `${displayHours}:${minutes} ${period}`;
        }
        
        return `${formatSingleTime(start)} - ${formatSingleTime(end)}`;
    }

    // Get facility name by ID
    function getFacilityNameById(id) {
        const facilities = {
            'soccer-field': 'Soccer Field',
            'swimming-pool': 'Swimming Pool',
            'basketball-court': 'Basketball Court',
            'gymnasium': 'Gymnasium'
        };
        return facilities[id] || 'Unknown Facility';
    }

    // Create a booking card element
    function createBookingCard(booking) {
        const article = document.createElement('article');
        article.className = 'booking-card';
        article.dataset.bookingId = booking.id;
        
        const facilityName = getFacilityNameById(booking.facility_id);
        const statusClass = booking.status.toLowerCase().replace(' ', '-');
        
        article.innerHTML = `
            <header>
                <h3>${facilityName}</h3>
                <p class="booking-status ${statusClass}">${booking.status}</p>
            </header>
            <section class="booking-details">
                <p><strong>Date:</strong> ${formatDateForDisplay(booking.date)}</p>
                <p><strong>Time:</strong> ${formatTimeSlotForDisplay(booking.time)}</p>
                <p><strong>Booking ID:</strong> ${booking.id}</p>
            </section>
            <footer>
                <button class="cancel-button" ${booking.status !== 'Pending' ? 'disabled' : ''}>
                    Cancel Booking
                </button>
            </footer>
        `;
        
        return article;
    }

    // Load user's bookings
    async function loadUserBookings(id) {
        try {
            noBookingsMessage.textContent = 'Loading your bookings...';
            
            const response = await fetch(`/api/v1/bookings/id/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }
            
            const result = await response.json();
            
            if (result.success && result.data.length > 0) {
                noBookingsMessage.hidden = true;
                
                // Clear existing bookings
                bookingsList.innerHTML = '';
                
                // Add each booking to the list
                result.data.forEach(booking => {
                    const card = createBookingCard(booking);
                    bookingsList.appendChild(card);
                    
                    // Add event listener to cancel button
                    const cancelButton = card.querySelector('.cancel-button');
                    if (cancelButton) {
                        cancelButton.addEventListener('click', () => cancelBooking(booking.id, card));
                    }
                });
            } else {
                noBookingsMessage.textContent = 'You have no bookings yet.';
            }
        } catch (error) {
            console.error('Error loading bookings:', error);
            noBookingsMessage.textContent = 'Failed to load bookings. Please try again later.';
        }
    }

    // Cancel a booking
    async function cancelBooking(bookingId, cardElement) {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/v1/bookings/update-status/${bookingId}/Cancelled`, {
                method: 'PATCH'
            });
            
            if (!response.ok) {
                throw new Error('Failed to cancel booking');
            }
            
            const result = await response.json();
            
            if (result.success) {
                // Update the UI to show cancelled status
                const statusElement = cardElement.querySelector('.booking-status');
                statusElement.textContent = 'Cancelled';
                statusElement.className = 'booking-status cancelled';
                
                // Disable the cancel button
                const cancelButton = cardElement.querySelector('.cancel-button');
                if (cancelButton) {
                    cancelButton.disabled = true;
                }
                
                alert('Booking cancelled successfully.');
            } else {
                throw new Error(result.message || 'Failed to cancel booking');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Failed to cancel booking. Please try again later.');
        }
    }

    // Handle sign out
    if (signOutButton) {
        signOutButton.addEventListener('click', () => {
            signOut(auth).then(() => {
                window.location.href = '../index.html';
            }).catch((error) => {
                console.error('Sign out error:', error);
            });
        });
    }

    // Check auth state and load bookings
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            userNameElement.textContent = user.displayName || user.email;
            
            // Load the user's bookings
            loadUserBookings(user.uid);
        } else {
            // User is signed out, redirect to login
            window.location.href = '../html/index.html';
        }
    });
});
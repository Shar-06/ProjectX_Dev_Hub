// viewBookings.js - View and manage user bookings
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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



document.addEventListener('DOMContentLoaded', () => {

    // DOM Elements
    const signOutButton = document.getElementById('sign-out-button');
    const loginPromptSection = document.getElementById('login-prompt');
    const signInButton = document.getElementById('sign-in-button');
    const loadingMessage = document.getElementById('loading-message');
    const noBookingsMessage = document.getElementById('no-bookings-message');
    const bookingsTable = document.getElementById('bookings-table');
    const bookingsTableBody = document.getElementById('bookings-table-body');
    const filterForm = document.getElementById('filter-form');
    const filterStatus = document.getElementById('filter-status');
    const filterFacility = document.getElementById('filter-facility');
    const filterDate = document.getElementById('filter-date');
    const bookingDetailsSection = document.getElementById('booking-details');
    const detailId = document.getElementById('detail-id');
    const detailFacility = document.getElementById('detail-facility');
    const detailDate = document.getElementById('detail-date');
    const detailTime = document.getElementById('detail-time');
    const detailStatus = document.getElementById('detail-status');
    const closeDetailsButton = document.getElementById('close-details-button');
    const cancelBookingButton = document.getElementById('cancel-booking-button');

    // Facility name mapping
    const facilityNames = {
        1: 'Gymnasium',
        2: 'Swimming Pool',
        3: 'Soccer Field',
        4: 'Basketball Court'
    };

    // Set minimum date to today for filter
    const today = new Date().toISOString().split('T')[0];
    filterDate.min = today;

    // Global variables
    let userBookings = [];
    let filteredBookings = [];
    let currentUser = null;

    // Check authentication state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            currentUser = user;
            loginPromptSection.hidden = true;
            // Fetch user bookings
            fetchUserBookings(user.uid);
        } else {
            // User is signed out
            currentUser = null;
            
            loginPromptSection.hidden = false;
            bookingsTable.hidden = true;
            loadingMessage.hidden = true;
            noBookingsMessage.hidden = true;
        }
    });

    // Sign out functionality
    if (signOutButton) {
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
    }

    // Sign in redirect
    if (signInButton) {
        signInButton.addEventListener('click', () => {
            window.location.href = '../html/LoginPage.html'; // Redirect to home/login page
        });
    }

    // Fetch user bookings from API
    async function fetchUserBookings(userId) {
        loadingMessage.hidden = false;
        noBookingsMessage.hidden = true;
        bookingsTable.hidden = true;
        
        try {
            // Get all bookings (in a real app, you might want to filter server-side)
            const response = await fetch('/api/v1/bookings/');
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }
            
            const result = await response.json();
            
            if (result.success) {
                // Filter bookings for current user
                userBookings = result.data.filter(booking => booking.resident_id === userId);
                
                // Apply any active filters
                applyFilters();
                
                // Update UI based on bookings
                if (userBookings.length === 0) {
                    noBookingsMessage.hidden = false;
                    bookingsTable.hidden = true;
                } else {
                    displayBookings(filteredBookings);
                    bookingsTable.hidden = false;
                    noBookingsMessage.hidden = true;
                }
            } else {
                throw new Error('Failed to get bookings data');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            alert('Failed to load bookings. Please try again later.');
            noBookingsMessage.textContent = 'Error loading bookings. Please try again later.';
            noBookingsMessage.hidden = false;
        } finally {
            loadingMessage.hidden = true;
        }
    }

    // Display bookings in table
    function displayBookings(bookings) {
        // Clear existing bookings
        bookingsTableBody.innerHTML = '';
        
        // Add each booking to the table
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            
            // Extract facility name
            const facilityName = facilityNames[booking.facility_id] || booking.facility_id;
            
            // Format date for display
            const formattedDate = formatDateForDisplay(booking.date);
            
            // Create facility cell
            const facilityCell = document.createElement('td');
            facilityCell.textContent = facilityName;
            row.appendChild(facilityCell);
            
            // Create date cell
            const dateCell = document.createElement('td');
            dateCell.textContent = formattedDate;
            row.appendChild(dateCell);
            
            // Create time cell
            const timeCell = document.createElement('td');
            timeCell.textContent = formatTimeForDisplay(booking.timeslot);
            row.appendChild(timeCell);
            
            // Create status cell
            const statusCell = document.createElement('td');
            statusCell.textContent = booking.status;
            // Add status-specific class for styling
            statusCell.classList.add(`status-${booking.status.toLowerCase()}`);
            row.appendChild(statusCell);
            
            // Create actions cell
            const actionsCell = document.createElement('td');
            
            // View details button
            const viewButton = document.createElement('button');
            viewButton.textContent = 'View Details';
            viewButton.classList.add('action-button');
            viewButton.dataset.bookingId = booking.id;
            viewButton.addEventListener('click', () => showBookingDetails(booking));
            actionsCell.appendChild(viewButton);
            
            // Cancel booking button (only for pending bookings)
            if (booking.status === 'Pending' || booking.status === 'Approved') {
                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancel';
                cancelButton.classList.add('action-button', 'cancel-button');
                cancelButton.dataset.bookingId = booking.id;
                cancelButton.addEventListener('click', () => cancelBooking(booking.id));
                actionsCell.appendChild(cancelButton);
            }
            
            row.appendChild(actionsCell);
            
            // Add row to table
            bookingsTableBody.appendChild(row);
        });
    }

    // Format date for display
    function formatDateForDisplay(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Format time for display
    function formatTimeForDisplay(timeSlot) {
        // Make sure we have a time string in the format "HH:MM-HH:MM"
        if (!timeSlot) return 'N/A';
        
        const [startTime, endTime] = timeSlot.split('-');
        if (!startTime || !endTime) return timeSlot; // Return original if format is unexpected
        
        // Format start time
        const [startHour, startMinutes] = startTime.trim().split(':').map(Number);
        const startPeriod = startHour >= 12 ? 'PM' : 'AM';
        const displayStartHours = startHour % 12 || 12;
        
        // Format end time
        const [endHour, endMinutes] = endTime.trim().split(':').map(Number);
        const endPeriod = endHour >= 12 ? 'PM' : 'AM';
        const displayEndHours = endHour % 12 || 12;
        
        return `${displayStartHours}:${startMinutes.toString().padStart(2, '0')} ${startPeriod} - 
                ${displayEndHours}:${endMinutes.toString().padStart(2, '0')} ${endPeriod}`;
    }

    // Show booking details
    function showBookingDetails(booking) {
        // Set details content
        detailId.textContent = `Booking ID: ${booking.id}`;
        detailFacility.textContent = `Facility: ${facilityNames[booking.facility_id] || booking.facility_id}`;
        detailDate.textContent = `Date: ${formatDateForDisplay(booking.date)}`;
        detailTime.textContent = `Time: ${formatTimeForDisplay(booking.time)}`;
        detailStatus.textContent = `Status: ${booking.status}`;
        
        // Show/hide cancel button based on status
        cancelBookingButton.hidden = !(booking.status === 'Pending' || booking.status === 'Approved');
        
        // Attach booking ID to cancel button
        cancelBookingButton.dataset.bookingId = booking.id;
        
        // Show details section
        bookingDetailsSection.hidden = false;
        
        // Scroll to details
        bookingDetailsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Close booking details
    if (closeDetailsButton) {
        closeDetailsButton.addEventListener('click', () => {
            bookingDetailsSection.hidden = true;
        });
    }

    // Cancel booking
    if (cancelBookingButton) {
        cancelBookingButton.addEventListener('click', () => {
            const bookingId = cancelBookingButton.dataset.bookingId;
            cancelBooking(bookingId);
        });
    }

    // Cancel booking function
    async function cancelBooking(bookingId) {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }
        
        try {
            // Call API to update booking status to 'Cancelled'
            const response = await fetch(`/api/v1/bookings/update-status/${bookingId}/Cancelled`, {
                method: 'PATCH'
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Booking cancelled successfully');
                // Hide details panel
                bookingDetailsSection.hidden = true;
                // Reload user bookings
                fetchUserBookings(currentUser.uid);
            } else {
                throw new Error('Failed to cancel booking');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Failed to cancel booking. Please try again later.');
        }
    }

    // Filter bookings
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            applyFilters();
        });
        
        filterForm.addEventListener('reset', () => {
            // Short delay to allow the form to reset before applying filters
            setTimeout(() => {
                applyFilters();
            }, 10);
        });
    }

    // Apply filters function
    function applyFilters() {
        const statusFilter = filterStatus.value;
        const facilityFilter = filterFacility.value;
        const dateFilter = filterDate.value;
        
        // Filter bookings
        filteredBookings = userBookings.filter(booking => {
            // Status filter
            if (statusFilter !== 'all' && booking.status !== statusFilter) {
                return false;
            }
            
            // Facility filter
            if (facilityFilter !== 'all' && booking.facility_id !== facilityFilter) {
                return false;
            }
            
            // Date filter (show bookings from the filter date forward)
            if (dateFilter && new Date(booking.date) < new Date(dateFilter)) {
                return false;
            }
            
            return true;
        });
        
        // Update UI based on filtered bookings
        if (filteredBookings.length === 0) {
            noBookingsMessage.textContent = 'No bookings match your filters.';
            noBookingsMessage.hidden = false;
            bookingsTable.hidden = true;
        } else {
            displayBookings(filteredBookings);
            bookingsTable.hidden = false;
            noBookingsMessage.hidden = true;
        }
    }
});
// script.js - Sports Facility Booking System
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const facilitiesSection = document.getElementById('facilities');
    const bookingSection = document.getElementById('booking-section');
    const confirmationSection = document.getElementById('confirmation-section');
    const bookButtons = document.querySelectorAll('.book-button');
    const bookingForm = document.getElementById('booking-form');
    const facilityNameOutput = document.getElementById('facility-name');
    const bookingDateInput = document.getElementById('booking-date');
    const timeSlotSelect = document.getElementById('time-slot');
    const swimmersField = document.getElementById('swimmers-field');
    const gymCapacityField = document.getElementById('gym-capacity-field');
    const confirmedFacility = document.getElementById('confirmed-facility');
    const confirmedDate = document.getElementById('confirmed-date');
    const confirmedTime = document.getElementById('confirmed-time');
    const confirmedParticipants = document.getElementById('confirmed-participants');
    const newBookingButton = document.getElementById('new-booking-button');

    // Add hidden input for facility ID (created dynamically)
    const facilityIdInput = document.createElement('input');
    facilityIdInput.type = 'hidden';
    facilityIdInput.id = 'facility-id';
    facilityIdInput.name = 'facility-id';
    bookingForm.appendChild(facilityIdInput);

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;

    // Facility-specific time slots
    const facilityTimeSlots = {
        'soccer-field': generateTimeSlots('08:00', '20:00', 2),
        'swimming-pool': generateTimeSlots('06:00', '20:00', 2),
        'basketball-court': generateTimeSlots('07:00', '22:00', 2),
        'gymnasium': generateTimeSlots('05:00', '22:00', 2)
    };

    // Facility-specific requirements
    const facilityRequirements = {
        'swimming-pool': {
            field: swimmersField,
            label: 'Number of Swimmers',
            confirmationText: 'Swimmers',
            inputId: 'swimmers'
        },
        'gymnasium': {
            field: gymCapacityField,
            label: 'Number of Participants',
            confirmationText: 'Participants',
            inputId: 'participants'
        }
    };

    // Handle book button clicks
    bookButtons.forEach(button => {
        button.addEventListener('click', () => {
            const facilityId = button.dataset.facility;
            const facilityName = button.closest('.facility').querySelector('h3').textContent;
            
            // Update form with selected facility
            facilityNameOutput.value = facilityName;
            facilityIdInput.value = facilityId;
            
            // Hide all extra fields first
            swimmersField.hidden = true;
            gymCapacityField.hidden = true;
            
            // Show relevant extra field if needed
            if (facilityRequirements[facilityId]) {
                const req = facilityRequirements[facilityId];
                req.field.hidden = false;
                req.field.querySelector('label').textContent = req.label;
            }
            
            // Generate time slots for this facility
            populateTimeSlots(facilityId);
            
            // Show booking form and hide other sections
            facilitiesSection.hidden = true;
            bookingSection.hidden = false;
            confirmationSection.hidden = true;
            
            // Focus on date input
            bookingDateInput.focus();
        });
    });

    // Generate array of time slots
    function generateTimeSlots(openTime, closeTime, durationHours) {
        const slots = [];
        const [openHour, openMinute] = openTime.split(':').map(Number);
        const [closeHour, closeMinute] = closeTime.split(':').map(Number);
        
        let currentHour = openHour;
        let currentMinute = openMinute;
        
        while (currentHour + durationHours <= closeHour || 
              (currentHour + durationHours === closeHour && currentMinute <= closeMinute)) {
            const startTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            const endHour = currentHour + durationHours;
            const endTime = `${endHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            slots.push(`${startTime}-${endTime}`);
            currentHour += 2;
        }
        return slots;
    }

    // Populate time slot dropdown
    function populateTimeSlots(facilityId) {
        timeSlotSelect.innerHTML = '<option value="">-- Select Time --</option>';
        facilityTimeSlots[facilityId].forEach(slot => {
            const option = document.createElement('option');
            option.value = slot;
            option.textContent = formatTimeSlotForDisplay(slot);
            timeSlotSelect.appendChild(option);
        });
    }

    // Format time slot for display
    function formatTimeSlotForDisplay(slot) {
        const [start, end] = slot.split('-');
        return `${formatTimeForDisplay(start)} - ${formatTimeForDisplay(end)}`;
    }

    // Format single time for display
    function formatTimeForDisplay(time) {
        const [hours, minutes] = time.split(':');
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes} ${period}`;
    }

    // Format date for display
    function formatDateForDisplay(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Generate a unique booking ID
    function generateBookingId() {
        return 'bk-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
    }

    // Handle form submission
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const facilityName = facilityNameOutput.value;
        const facilityId = facilityIdInput.value;
        const date = bookingDateInput.value;
        const time = timeSlotSelect.value;
        const [startTime, endTime] = time.split('-');
        
        // Get participants
        let participants = null;
        let participantsText = '';
        
        for (const [id, req] of Object.entries(facilityRequirements)) {
            if (!req.field.hidden) {
                participants = document.getElementById(req.inputId).value;
                participantsText = `${req.confirmationText}: ${participants}`;
                break;
            }
        }
        
        // Create booking JSON object
        const bookingData = {
            id: generateBookingId(),
            start_time: startTime.trim(),
            end_time: endTime.trim(),
            status: "In-Progress",
            date: date,
            facility_id: facilityId,  
            resident_id: loggedInID
        };

        console.log('Booking created:', bookingData);
        
        // Update confirmation section
        confirmedFacility.textContent = `Facility: ${facilityName}`;
        confirmedDate.textContent = `Date: ${formatDateForDisplay(date)}`;
        confirmedTime.textContent = `Time: ${formatTimeSlotForDisplay(time)}`;
        
        if (participantsText) {
            confirmedParticipants.textContent = participantsText;
            confirmedParticipants.hidden = false;
        } else {
            confirmedParticipants.hidden = true;
        }
        
        // Show confirmation and hide form
        bookingSection.hidden = true;
        confirmationSection.hidden = false;
        confirmationSection.scrollIntoView({ behavior: 'smooth' });
        
        // Reset form for next booking
        bookingForm.reset();
        facilityNameOutput.value = 'Not selected';
    });

    // Make Another Booking Button Functionality
    if (newBookingButton) {
        newBookingButton.addEventListener('click', function() {
            confirmationSection.hidden = true;
            facilitiesSection.hidden = false;
            bookingForm.reset();
            facilityNameOutput.value = 'Not selected';
            swimmersField.hidden = true;
            gymCapacityField.hidden = true;
            facilitiesSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Logged-in user data
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            const email = user.email;
            const displayName = user.displayName;

            console.log("User ID: " + uid);
            console.log("User Email: " + email);
            console.log("User Display Name: " + displayName);
            // ...
        } else {
            // User is signed out
            // ...
        }
        });

});
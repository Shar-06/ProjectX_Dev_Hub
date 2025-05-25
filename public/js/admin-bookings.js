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


function createBookingNotification(currentUserid, currentUsername){
    const currentTime = new Date().toTimeString().split(' ')[0];;
    const currentDate = new Date().toISOString().split('T')[0];
    const viewStatus = "unread";
    const notificationType = "booking-updated";
    const notificationMessage = "booking has been approved";
    
    fetch(`/api/v1/notifications/post-notification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ date:currentDate,timeslot:currentTime,status:viewStatus,message:notificationMessage,userid:currentUserid,type:notificationType,username:currentUsername}),
        })
        .then((response) => {
             if (!response.ok) throw new Error("Failed to create an updated booking notification");
                return response.json();
        })
        .then(() => {
        })
}

document.addEventListener("DOMContentLoaded", () => {
    const bookingRequestsTable = document.querySelector(
        'section[aria-labelledby="booking-requests-heading"] tbody'
    );
    const userBookingsTable = document.querySelector(
        'section[aria-labelledby="user-bookings-heading"] tbody'
    );

    fetch('/api/v1/bookings/')
        .then((response) => response.json())
        .then((data) => {
            if (!Array.isArray(data.data)) {
                throw new Error("Expected an array but received something else.");
            }

            data.data.forEach((booking) => {
                const row = document.createElement("tr");

                if(booking.status === null){
                    booking.status = "Pending";
                }

                row.innerHTML = `
                    <td>${booking.id}</td>
                    <td>${booking.name}</td>
                    <td>${getFacilityName(booking.facility_id)}</td>
                    <td>${booking.timeslot || "N/A"}</td>
                    <td>${new Date(booking.date).toLocaleDateString()}</td>
                    <td class="status">${booking.status}</td>
                `;

                if (booking.status.toLowerCase() === "pending") {
                    const actionCell = document.createElement("td");

                    const approveBtn = document.createElement("button");
                    approveBtn.textContent = "Approve";
                    approveBtn.className = "approve-booking";

                    const denyBtn = document.createElement("button");
                    denyBtn.textContent = "Deny";
                    denyBtn.className = "deny-booking danger";

                    approveBtn.addEventListener("click", () => {
                        updateBookingStatus(booking.id, "Approved", row);
                    });

                    denyBtn.addEventListener("click", () => {

                        updateBookingStatus(booking.id, "Denied", row);
                    });

                    actionCell.appendChild(approveBtn);
                    actionCell.appendChild(denyBtn);
                    row.appendChild(actionCell);

                    bookingRequestsTable.appendChild(row);
                } else {
                    userBookingsTable.appendChild(row);
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching booking data:", error);
        });

    function getFacilityName(facilityId) {
        const facilities = {
            1: 'Gymnasium',
            2: 'Swimming Pool',
            3: 'Soccer Field',
            4: 'Basketball Court'
        };
        return facilities[facilityId] || 'Unknown Facility';
    }

    function updateBookingStatus(id, newStatus, row) {
        fetch(`/api/v1/bookings/update-status/${id}/${newStatus}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to update booking");
                return response.json();
            })
            .then(() => {
                onAuthStateChanged(auth, (user) => {
                        if (user) {

                            createBookingNotification(user.uid,user.displayName);
                        }
                        else{}
                });
                
                const statusCell = row.querySelector(".status");
                statusCell.textContent = newStatus;

                const lastCell = row.lastElementChild;
                if (lastCell && lastCell.querySelector("button")) {
                    row.removeChild(lastCell);
                }

                bookingRequestsTable.removeChild(row);
                userBookingsTable.appendChild(row);
            })
            .catch((error) => {
                console.error("Update error:", error);
                alert("Could not update the booking status. Try again.");
            });
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

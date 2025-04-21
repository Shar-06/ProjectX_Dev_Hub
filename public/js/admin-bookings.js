document.addEventListener("DOMContentLoaded", () => {
const bookingRequestsTable = document.querySelector(
    'section[aria-labelledby="booking-requests-heading"] tbody'
);
const userBookingsTable = document.querySelector(
    'section[aria-labelledby="user-bookings-heading"] tbody'
);

fetch("https://localhost:3500/api/v1/booking/")
    .then((response) => response.json())
    .then((data) => {
    data.forEach((booking) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${booking.id}</td>
        <td>${booking.resident_id}</td>
        <td>${booking.facility_id}</td>
        <td>${booking.timeSlot}</td>
        <td>${booking.date}</td>
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

function updateBookingStatus(id, newStatus, row) {
    fetch(`https://localhost:3500/api/v1/bookings/${id}`, {
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
    .then((updatedBooking) => {
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
});

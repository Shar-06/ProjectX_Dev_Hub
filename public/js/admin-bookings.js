document.addEventListener("DOMContentLoaded", () => {
    const bookingRequestsTable = document.querySelector(
        'section[aria-labelledby="booking-requests-heading"] tbody'
    );
    const userBookingsTable = document.querySelector(
        'section[aria-labelledby="user-bookings-heading"] tbody'
    );

    fetch("/api/v1/bookings/")
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
                    <td>${booking.resident_id}</td>
                    <td>${booking.facility_id}</td>
                    <td>${booking.time || "N/A"}</td>
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
                        console.log("Approving booking ID:", booking.id);
                        updateBookingStatus(booking.id, "Approved", row);
                    });

                    denyBtn.addEventListener("click", () => {
                        console.log("Denying booking ID:", booking.id);
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

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("eventForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Extract values from form
        const title = document.getElementById("eventTitle").value;
        const facility_id = parseInt(document.getElementById("facility").value);
        const date = new Date(document.getElementById("eventDate").value).toISOString(); // Format correctly
        const host = document.getElementById("hostedBy").value;
        const description = document.getElementById("description").value;
        const timeslot = document.getElementById("timeslot").value; // You need a field for this
        const imageurl = document.getElementById("imageurl").value || null; // Optional

        const jsonData = JSON.stringify({
            title,
            description,
            timeslot,
            facility_id,
            date,
            host,
            imageurl
        });

        try {
            const response = await fetch('/api/v1/events/postEvent', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: jsonData
            });

            if (response.ok) {
                const createdEvent = await response.json();
                console.log("Created Event:", createdEvent);
                alert("Event created successfully!");
                window.location.href = "admin-events.html";
            } else {
                const errorData = await response.json();
                alert("Failed to create event: " + (errorData.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while creating the event.");
        }
    });
});

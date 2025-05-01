document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("eventForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const eventTitle = document.getElementById("eventTitle").value;
        const facility = document.getElementById("facility").value;
        const eventDate = document.getElementById("eventDate").value;
        const hostedBy = document.getElementById("hostedBy").value;
        const description = document.getElementById("description").value;

        const jsonData = JSON.stringify({
            eventTitle, facility, eventDate, hostedBy, description
        });

        try {
            const response = await fetch('/api/v1/events/postEvent', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: jsonData
            });

            if (response.ok) {
                alert("Event created successfully!");
                form.reset();
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
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("eventForm");
    
    if (!form) {
        console.error("Event form not found.");
        return;
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("id", "11");
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
});

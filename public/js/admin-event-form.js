function doNotification() {
    const currentDate = new Date();
    let currentTime = currentDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const notification = {
       date: currentDate,
       timeslot: currentTime,
       status:'unread',
       message: "Swimming pool has been booked for the local women's competition",
       userid: "admin",
       type: "event",
       username: "admin"
    };

    fetch('/api/v1/notifications/post-notification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify(notification)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success in creating notification:', data);
       // window.location.href = 'dashboard.html';
    })
    .catch((error) => {
        console.error('Error:', error);
        //window.location.href = 'dashboard.html';
    });
};

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("eventForm");
    
    if (!form) {
        console.error("Event form not found.");
        return;
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
    
        const formData = new FormData();
        //formData.append("id", "11");
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

                //doNotification();

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



document.addEventListener("DOMContentLoaded", () => {

    //LOGIN USER ID
    const userId = "qqGacIwBNGRLpK4gB1sOKrkBte73";
    
    fetch('/api/v1/notifications/type/event', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const notifications = data.data || data;
        if(notifications.length != 0){
                    const notificationBookingsList = document.getElementById("notification-events-list");
        console.log(notificationBookingsList);

        notifications.forEach(notification => {
            const li = document.createElement("li");
            li.className = "notification";
            const dateObj = new Date(notification.date);

            // Format the date part
            const formattedDate = dateObj.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
            });

            // Final display string
            const displayTime = `${formattedDate} ${notification.timeslot}`;

            li.innerHTML = `
                <p>${notification.message}
                </p>
                <time>${displayTime}</time>
            `;
            notificationBookingsList.appendChild(li);
        });
        }
        else{
            const notificationBookingsList = document.getElementById("notification-events-list");
            console.log(notificationBookingsList);
            const li = document.createElement("li");
            li.className = "notification";
            li.innerHTML = `
                <p>No notifications available</p>
            `;
            notificationBookingsList.appendChild(li);
        }
    })
    .catch(error => {
       console.log("error while fetching notifications: "+ error)
    })

    fetch(`/api/v1/notifications/id/type/${userId}/booking-updated`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const notifications = data.data || data;
        if(notifications.length != 0){
            const notificationBookingsList = document.getElementById("notification-approved-list");
        console.log(notificationBookingsList);

        notifications.forEach(notification => {
            const li = document.createElement("li");
            li.className = "notification";
            const dateObj = new Date(notification.date);

            // Format the date part
            const formattedDate = dateObj.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
            });

            // Final display string
            const displayTime = `${formattedDate} ${notification.timeslot}`;

            li.innerHTML = `
                <p>${notification.message} by user 
                <strong>${notification.username}</strong>
                <p>
                <time>${displayTime}</time>
            `;
            notificationBookingsList.appendChild(li);
        });
        }
        else{
            const notificationBookingsList = document.getElementById("notification-approved-list");
            console.log(notificationBookingsList);
            const li = document.createElement("li");
            li.className = "notification";
            li.innerHTML = `
                <p>No notifications available</p>
            `;
            notificationBookingsList.appendChild(li);
        }
    })
    .catch(error => {
       console.log("error while fetching notifications: "+ error)
    })
    fetch(`/api/v1/notifications/id/type/${userId}/report-updated`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const notifications = data.data || data;
        if(notifications.length != 0){
                    const notificationBookingsList = document.getElementById("notification-reports-list");
        console.log(notificationBookingsList);

        notifications.forEach(notification => {
            const li = document.createElement("li");
            li.className = "notification";
            const dateObj = new Date(notification.date);

            // Format the date part
            const formattedDate = dateObj.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
            });

            // Final display string
            const displayTime = `${formattedDate} ${notification.timeslot}`;

            li.innerHTML = `
                <p>${notification.message} by user 
                <strong>${notification.username}</strong> 
                </p>
                <time>${displayTime}</time>
            `;
            notificationBookingsList.appendChild(li);
        });
        }
        else{
            const notificationBookingsList = document.getElementById("notification-reports-list");
            console.log(notificationBookingsList);
            const li = document.createElement("li");
            li.className = "notification";
            li.innerHTML = `
                <p>No notifications available</p>
            `;
            notificationBookingsList.appendChild(li);
        }
    })
    .catch(error => {
       console.log("error while fetching notifications: "+ error)
    })
});
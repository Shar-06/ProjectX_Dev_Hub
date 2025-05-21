document.addEventListener("DOMContentLoaded", () => {
    
    fetch('/api/v1/notifications/type/booking-created', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const notifications = data.data || data;
        if(notifications.length != 0){
             const notificationBookingsList = document.getElementById("notification-bookings-list");
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
                with user ID 
                <strong >${notification.userid}</strong>.
                </p>
                <time>${displayTime}</time>
            `;
            notificationBookingsList.appendChild(li);
        });
        }
        else{
            const notificationBookingsList = document.getElementById("notification-bookings-list");
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

    fetch('/api/v1/notifications/type/user-created', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const notifications = data.data || data;
        if(notifications.length != 0 ){
            const notificationBookingsList = document.getElementById("notification-role-list");
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
                    with user ID 
                    <strong >${notification.userid}</strong>.
                    </p>
                    <time>${displayTime}</time>
                `;
                notificationBookingsList.appendChild(li);
            });
        }
        else{
            const notificationBookingsList = document.getElementById("notification-role-list");
            console.log(notificationBookingsList);
            console.log("no data");
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
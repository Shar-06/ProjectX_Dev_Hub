

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
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth,  signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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

document.addEventListener("DOMContentLoaded", () => {


    const roles = ["Resident", "Facility Staff"];
    const tableBody = document.querySelector("table tbody");

    fetch('/api/v1/users/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const users = data.data || data;

        tableBody.innerHTML = "";

        users.forEach(user => {

            const userName = user.name;
            const userEmail = user.email;

            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = user.id;

            const nameCell = document.createElement("td");
            nameCell.textContent = user.name;

            const roleCell = document.createElement("td");
            const normalizedRole = (!user.role || user.role.trim() === '""') ? "" : user.role;
            roleCell.textContent = normalizedRole;

            const actionsCell = document.createElement("td");

            const roleButton = document.createElement("button");
            roleButton.className = "role-button";
            if (normalizedRole === "") {
                roleButton.textContent = "Assign Role";
            } else {
                roleButton.textContent = "Edit Role";
            }

            const revokeButton = document.createElement("button");
            revokeButton.className = "access-button danger";

            if (normalizedRole === "") {
                revokeButton.textContent = "Access Denied";
                revokeButton.disabled = true;
            } else {
                revokeButton.textContent = "Revoke Access";
                revokeButton.disabled = false;
            }

            roleButton.addEventListener("click", () => {
                const select = document.createElement("select");
                roles.forEach(role => {
                    const option = document.createElement("option");
                    option.value = role;
                    option.textContent = role;
                    select.appendChild(option);
                });

                select.value = normalizedRole === "" ? roles[0] : normalizedRole;

                const confirmBtn = document.createElement("button");
                confirmBtn.textContent = "Confirm";
                confirmBtn.style.marginLeft = "8px";

                roleButton.style.display = "none";
                actionsCell.appendChild(select);
                actionsCell.appendChild(confirmBtn);

                confirmBtn.addEventListener("click", () => {
                    const selectedRole = select.value;
                    const selectedID = user.id;

                    fetch(`/api/v1/users/update-role/${selectedID}/${selectedRole}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ role: selectedRole }),
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(err => {
                                throw new Error(err.message || "Failed to update user role");
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        roleCell.textContent = selectedRole;
                        user.role = selectedRole;

                        roleButton.textContent = "Edit Role";
                        roleButton.style.display = "inline-block";
                        revokeButton.textContent = "Revoke Access";
                        revokeButton.disabled = false;

                        select.remove();
                        confirmBtn.remove();
                    })

                    fetch('/api/v1/send-welcome-email', { //Link for email api
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: userEmail,
                            name: userName
                        }),
                    })
                    .then(emailResponse => emailResponse.json())
                    .then(emailData => {
                        console.log('Welcome email sent:', emailData);
                    })
                    .catch(emailError => {
                        console.error('Failed to send welcome email:', emailError);
                    });
                })

                    .catch(error => {
                        alert(`Failed to update role: ${error.message}`);
                        select.remove();
                        confirmBtn.remove();
                        roleButton.style.display = "inline-block";
                    });
                });

            revokeButton.addEventListener("click", () => {
                if (user.role === "") return;

                const selectedID = user.id;

                fetch(`https://communitysportsx-a0byh7gsa5fhf7gf.centralus-01.azurewebsites.net/api/v1/users/update-role/${selectedID}/""`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            throw new Error(err.message || "Failed to revoke access");
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    roleCell.textContent = "";
                    user.role = "";

                    roleButton.textContent = "Assign Role";
                    revokeButton.textContent = "Access Denied";
                    revokeButton.disabled = true;
                })
                .catch(error => {
                    alert(`Failed to revoke access: ${error.message}`);
                });
            });

            actionsCell.appendChild(roleButton);
            actionsCell.appendChild(revokeButton);

            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(roleCell);
            row.appendChild(actionsCell);

            tableBody.appendChild(row);
        });
    })
    .catch((error) => {
        console.error('Error fetching users:', error);
    });

    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("user-search");

    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const query = searchInput.value.trim().toLowerCase();

        document.querySelectorAll("table tbody tr").forEach(row => {
            const userId = row.children[0].textContent.toLowerCase();
            const userName = row.children[1].textContent.toLowerCase();

            if (userId.includes(query) || userName.includes(query)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
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

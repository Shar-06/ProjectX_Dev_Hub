document.addEventListener("DOMContentLoaded", () => {
    ///Socket stuff
    const socket = io();
    socket.on(`connect`, function () {
        console.log(`Connected to server from admin page`);

        socket.on('newUserCreated', function (message) {
            console.log("new user has just entered the chat")
            alert(`new user just registered!!\nUsername: ${message.from} at ${message.createdAt}`);
        });
    });

    socket.on('disconnect', function () {
        console.log('user just disconnected');
    });

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
                roleButton.textContent = normalizedRole === "" ? "Assign Role" : "Edit Role";

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
                    roleButton.style.display = "none";

                    // Create dropdown
                    const select = document.createElement("select");
                    select.style.marginLeft = "6px";
                    roles.forEach(role => {
                        const option = document.createElement("option");
                        option.value = role;
                        option.textContent = role;
                        select.appendChild(option);
                    });
                    select.value = normalizedRole === "" ? roles[0] : normalizedRole;

                    // ✅ button
                    const confirmBtn = document.createElement("button");
                    confirmBtn.textContent = "✅";
                    confirmBtn.style.marginLeft = "6px";
                    confirmBtn.title = "Confirm";

                    // ❌ button
                    const cancelBtn = document.createElement("button");
                    cancelBtn.textContent = "❌";
                    cancelBtn.style.marginLeft = "4px";
                    cancelBtn.title = "Cancel";

                    actionsCell.appendChild(select);
                    actionsCell.appendChild(confirmBtn);
                    actionsCell.appendChild(cancelBtn);

                    confirmBtn.addEventListener("click", () => {
                        const selectedRole = select.value;
                        const selectedID = user.id;

                        fetch(`/api/v1/users/update-role/${selectedID}/${selectedRole}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
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
                            .then(() => {
                                roleCell.textContent = selectedRole;
                                user.role = selectedRole;

                                roleButton.textContent = "Edit Role";
                                roleButton.style.display = "inline-block";
                                revokeButton.textContent = "Revoke Access";
                                revokeButton.disabled = false;

                                select.remove();
                                confirmBtn.remove();
                                cancelBtn.remove();
                            })
                            .catch(error => {
                                alert(`Failed to update role: ${error.message}`);
                                select.remove();
                                confirmBtn.remove();
                                cancelBtn.remove();
                                roleButton.style.display = "inline-block";
                            });

                        // Send welcome email
                        fetch('/api/v1/send-welcome-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: userEmail, name: userName }),
                        })
                            .then(res => res.json())
                            .then(data => console.log('Welcome email sent:', data))
                            .catch(err => console.error('Failed to send welcome email:', err));
                    });

                    cancelBtn.addEventListener("click", () => {
                        select.remove();
                        confirmBtn.remove();
                        cancelBtn.remove();
                        roleButton.style.display = "inline-block";
                    });
                });

                revokeButton.addEventListener("click", () => {
                    if (user.role === "") return;

                    const selectedID = user.id;

                    fetch(`/api/v1/users/update-role/${selectedID}/""`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                    })
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(err => {
                                    throw new Error(err.message || "Failed to revoke access");
                                });
                            }
                            return response.json();
                        })
                        .then(() => {
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
});

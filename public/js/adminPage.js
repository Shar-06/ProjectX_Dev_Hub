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
            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = user.id;

            const nameCell = document.createElement("td");
            nameCell.textContent = user.name;

            const roleCell = document.createElement("td");
            const normalizedRole = (!user.role || user.role.trim() === '""') ? "" : user.role;
            roleCell.textContent = normalizedRole;

            const actionsCell = document.createElement("td");

            // Role Button: Assign Role or Edit Role
            const roleButton = document.createElement("button");
            roleButton.className = "role-button";
            roleButton.textContent = normalizedRole === "" ? "Assign Role" : "Edit Role";

            // Revoke Access Button
            const revokeButton = document.createElement("button");
            revokeButton.className = "access-button danger";

            if (normalizedRole === "") {
                revokeButton.textContent = "Access Denied";
                revokeButton.disabled = true;
            } else {
                revokeButton.textContent = "Revoke Access";
                revokeButton.disabled = false;
            }

            // Role Assignment Logic
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

                        // Update button text/content after assigning role
                        roleButton.textContent = "Edit Role";
                        roleButton.style.display = "inline-block";
                        revokeButton.textContent = "Revoke Access";
                        revokeButton.disabled = false;

                        select.remove();
                        confirmBtn.remove();
                    })
                    .catch(error => {
                        alert(`Failed to update role: ${error.message}`);
                        select.remove();
                        confirmBtn.remove();
                        roleButton.style.display = "inline-block";
                    });
                });
            });

            // Revoke Access Logic
            revokeButton.addEventListener("click", () => {
                if (user.role === "") return;

                const selectedID = user.id;

                fetch(`/api/v1/users/update-role/${selectedID}/""`, {
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

                    // Update button text/content after revoking access
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

    // Search functionality
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

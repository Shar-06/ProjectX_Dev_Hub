document.addEventListener("DOMContentLoaded", () => {
    const roles = ["Resident", "Facility Staff"];
    const tableBody = document.querySelector("table tbody");

    fetch('http://localhost:3500/api/v1/users/', {
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
            roleCell.textContent = user.role || "None";

            const actionsCell = document.createElement("td");

            const roleButton = document.createElement("button");
            // Set initial button text based on role
            roleButton.textContent = (user.role === null || user.role === "None") ? "Assign Role" : "Edit Role";
            roleButton.className = "role-button";

            roleButton.addEventListener("click", () => {
                const select = document.createElement("select");
                roles.forEach(role => {
                    const option = document.createElement("option");
                    option.value = role;
                    option.textContent = role;
                    select.appendChild(option);
                });

                select.value = (user.role === null || user.role === "None") ? roles[0] : user.role;

                const confirmBtn = document.createElement("button");
                confirmBtn.textContent = "Confirm";
                confirmBtn.style.marginLeft = "8px";

                roleButton.style.display = "none";
                actionsCell.appendChild(select);
                actionsCell.appendChild(confirmBtn);

                confirmBtn.addEventListener("click", () => {
                    const selectedRole = select.value;
                    const selectedID = user.id;

                    fetch(`http://localhost:3500/api/v1/users/update-role/${selectedID}/${selectedRole}`, {
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

                        select.remove();
                        confirmBtn.remove();
                        roleButton.style.display = "inline-block";
                        roleButton.textContent = "Edit Role";
                    })
                    .catch(error => {
                        alert(`Failed to update role: ${error.message}`);
                        select.remove();
                        confirmBtn.remove();
                        roleButton.style.display = "inline-block";
                    });
                });
            });

            const revokeButton = document.createElement("button");
            revokeButton.textContent = "Revoke Access";
            revokeButton.className = "access-button danger";

            revokeButton.addEventListener("click", () => {
                revokeButton.textContent = "Access Denied";
                revokeButton.disabled = true;
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

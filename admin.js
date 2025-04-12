document.addEventListener("DOMContentLoaded", () => {
    const roles = ["Resident", "Facility Staff"];

    document.querySelectorAll("table tbody tr").forEach(row => {
        const roleButton = row.querySelector(".role-button");
        const revokeButton = row.querySelector(".access-button");
        const roleCell = row.children[2];

        if (roleButton) {
            roleButton.addEventListener("click", () => {
                const select = document.createElement("select");
                roles.forEach(roleOption => {
                    const option = document.createElement("option");
                    option.value = roleOption;
                    option.textContent = roleOption;
                    select.appendChild(option);
                });

                if (roleButton.textContent === "Edit") {
                    const currentRole = roleCell.textContent;
                    select.value = currentRole;
                }

                const confirmBtn = document.createElement("button");
                confirmBtn.textContent = "Confirm";
                confirmBtn.style.marginLeft = "8px";

                roleButton.style.display = "none";
                roleButton.parentNode.appendChild(select);
                roleButton.parentNode.appendChild(confirmBtn);

                confirmBtn.addEventListener("click", () => {
                    const selectedRole = select.value;

                    roleCell.textContent = selectedRole;
                    roleButton.textContent = "Edit";

                    select.remove();
                    confirmBtn.remove();
                    roleButton.style.display = "inline-block";
                });
            });
        }

        if (revokeButton) {
            revokeButton.addEventListener("click", () => {
                revokeButton.textContent = "Access Denied";
                revokeButton.disabled = true;
            });
        }
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

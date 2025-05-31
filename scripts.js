document.addEventListener("DOMContentLoaded", () => {
    // Handle dropdown menu toggling
    document.querySelectorAll(".dropdown-button").forEach(button => {
        button.addEventListener("click", (event) => {
            const dropdownMenu = event.target.nextElementSibling;
            const isVisible = dropdownMenu.style.display === "block";
            document.querySelectorAll(".dropdown-menu").forEach(menu => menu.style.display = "none");
            dropdownMenu.style.display = isVisible ? "none" : "block";
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".dropdown")) {
            document.querySelectorAll(".dropdown-menu").forEach(menu => menu.style.display = "none");
        }
    });

    // Redirect to the first page when "Guardar alterações" is clicked
    const saveButton = document.querySelector(".save-button");
    if (saveButton) {
        saveButton.addEventListener("click", () => {
            alert("Alterações guardadas com sucesso!");
            window.location.href = "index.html"; // Redirect to the first page
        });
    }

    // Redirect to the first page when "Eliminar Auditoria" is clicked
    const deleteButton = document.querySelector(".delete-button");
    if (deleteButton) {
        deleteButton.addEventListener("click", () => {
            const confirmDelete = confirm("Tem a certeza que deseja eliminar esta auditoria?");
            if (confirmDelete) {
                alert("Auditoria eliminada com sucesso!");
                window.location.href = "index.html"; // Redirect to the first page
            }
        });
    }
});

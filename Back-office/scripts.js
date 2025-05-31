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
});

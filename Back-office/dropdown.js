/**
 * Dropdown menu handler
 * This script manages the dropdown menus in the application
 */

// Function to position and show dropdown
function showDropdown(toggle, menu) {
    // Get position of toggle button
    const rect = toggle.getBoundingClientRect();
    
    // Position the dropdown absolutely to the viewport
    menu.style.position = 'fixed';
    menu.style.top = (rect.bottom + 5) + 'px';
    menu.style.right = (window.innerWidth - rect.right) + 'px';
    menu.style.display = 'block';
    menu.style.zIndex = '10000'; // Very high z-index
    
    // Add visible class
    menu.classList.add('visible');
}

// Initialize dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    // Find all dropdowns
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    // Keep track of currently open dropdown
    let openDropdown = null;
    
    // Add click handlers to all dropdown toggles
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get the dropdown menu
            const menu = this.nextElementSibling;
            const dropdown = this.parentElement;
            
            // Close currently open dropdown if it's not this one
            if (openDropdown && openDropdown !== dropdown) {
                openDropdown.querySelector('.dropdown-menu').style.display = 'none';
                openDropdown.classList.remove('active');
            }
            
            // Toggle this dropdown
            if (menu.style.display === 'block') {
                menu.style.display = 'none';
                dropdown.classList.remove('active');
                openDropdown = null;
            } else {
                showDropdown(this, menu);
                dropdown.classList.add('active');
                openDropdown = dropdown;
            }
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown') && openDropdown) {
            openDropdown.querySelector('.dropdown-menu').style.display = 'none';
            openDropdown.classList.remove('active');
            openDropdown = null;
        }
    });
    
    // Close dropdown when pressing ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && openDropdown) {
            openDropdown.querySelector('.dropdown-menu').style.display = 'none';
            openDropdown.classList.remove('active');
            openDropdown = null;
        }
    });
});

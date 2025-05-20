/**
 * Special fix for Gestão Materiais dropdowns
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the Gestão Materiais page
    if (document.title.includes('Gestão de Materiais')) {
        console.log('Applying special dropdown fixes for Gestão Materiais page');
        
        // Remove any old dropdown implementations
        document.querySelectorAll('.options-container').forEach(el => {
            el.remove();
        });
        
        // Function to fix dropdowns that might not have been initialized properly
        function fixDropdowns() {
            document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
                // Make sure click handlers are working
                toggle.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close all other open dropdowns
                    document.querySelectorAll('.dropdown-menu').forEach(menu => {
                        menu.style.display = 'none';
                    });
                    
                    // Get this dropdown's menu
                    const menu = this.nextElementSibling;
                    if (!menu) return;
                    
                    // Position and show the menu
                    const rect = this.getBoundingClientRect();
                    menu.style.position = 'fixed';
                    menu.style.top = (rect.bottom + 5) + 'px';
                    menu.style.right = (window.innerWidth - rect.right) + 'px';
                    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                    menu.style.zIndex = '10000';
                };
            });
        }
        
        // Run the fix after a short delay to ensure DOM is fully ready
        setTimeout(fixDropdowns, 500);
        
        // Handle clicks outside dropdowns
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.style.display = 'none';
                });
            }
        });
    }
});

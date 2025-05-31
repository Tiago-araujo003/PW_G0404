/**
 * Script para gerenciar os dropdowns da aplicação
 * Este script substitui o comportamento padrão para garantir que
 * os dropdowns apareçam sobre outros elementos da página
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos os dropdowns na página
    initializeAllDropdowns();
    
    // Reexportar para uso global
    window.initializeDropdowns = initializeAllDropdowns;
});

function initializeAllDropdowns() {
    // Remover listeners existentes para evitar duplicação
    document.querySelectorAll('.dropdown-toggle').forEach(button => {
        button.removeEventListener('click', toggleDropdown);
        // Usar addEventListener com parâmetro explícito para possibilitar remoção posterior
        button.addEventListener('click', toggleDropdown);
    });
    
    // Adicionar listener global para fechar dropdowns ao clicar fora
    document.removeEventListener('click', closeAllDropdownsOnClickOutside);
    document.addEventListener('click', closeAllDropdownsOnClickOutside);
}

function toggleDropdown(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const dropdown = this.closest('.dropdown');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    // Fechar todos os outros dropdowns abertos
    document.querySelectorAll('.dropdown.active').forEach(d => {
        if (d !== dropdown) {
            d.classList.remove('active');
            d.querySelector('.dropdown-menu').style.display = 'none';
        }
    });
    
    // Alternar o estado do dropdown atual
    if (dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        menu.style.display = 'none';
    } else {
        dropdown.classList.add('active');
        
        // Ajustar posicionamento e visibilidade do menu
        const buttonRect = this.getBoundingClientRect();
        const pageScrollY = window.scrollY || document.documentElement.scrollTop;
        const pageScrollX = window.scrollX || document.documentElement.scrollLeft;
        
        menu.style.position = 'fixed';
        menu.style.top = (buttonRect.bottom + 5) + 'px';
        menu.style.right = (window.innerWidth - buttonRect.right) + 'px';
        menu.style.zIndex = '10000'; // Valor alto para garantir que fique por cima
        menu.style.display = 'block';
    }
}

function closeAllDropdownsOnClickOutside(e) {
    if (!e.target.closest('.dropdown-toggle')) {
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.display = 'none';
            }
        });
    }
}

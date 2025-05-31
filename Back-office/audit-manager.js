/**
 * Script para gerenciar as auditorias e garantir que os dropdowns funcionem
 */
document.addEventListener('DOMContentLoaded', function() {
    // Corrigir o botão "Criar Nova Auditoria"
    const btnNovaAuditoria = document.querySelector('.btn-nova-auditoria');
    if (btnNovaAuditoria) {
        btnNovaAuditoria.href = "edir-audit.html";
    }

    // Carregar auditorias do localStorage ou usar dados padrão
    const auditoriasString = localStorage.getItem('auditorias');
    
    if (auditoriasString) {
        const auditorias = JSON.parse(auditoriasString);
        const tbody = document.querySelector('.audits-table tbody');
        
        if (tbody) {
            // Limpar a tabela existente
            tbody.innerHTML = '';
            
            // Preencher com os dados armazenados
            Object.values(auditorias).forEach(auditoria => {
                const tr = document.createElement('tr');
                tr.setAttribute('data-audit-id', auditoria.id);
                
                // Formatar a data para DD/MM/YYYY
                const dataParts = auditoria.data.split('-');
                const dataFormatada = dataParts.length === 3 ? 
                    `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}` : auditoria.data;
                
                // Determinar a classe CSS com base no status
                let statusClass = '';
                switch(auditoria.status.toLowerCase()) {
                    case 'aprovada': statusClass = 'green'; break;
                    case 'pendente': statusClass = 'yellow'; break;
                    case 'rejeitada': statusClass = 'red'; break;
                    default: statusClass = 'yellow';
                }
                
                tr.innerHTML = `
                    <td>#${auditoria.id}</td>
                    <td>${auditoria.titulo}</td>
                    <td>${auditoria.localizacao}</td>
                    <td>${dataFormatada}</td>
                    <td>${auditoria.peritos.join(', ')}</td>
                    <td><span class="status ${statusClass}">${auditoria.status}</span></td>
                    <td class="dropdown-cell">
                        <div class="dropdown">
                            <button class="dropdown-toggle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <circle cx="12" cy="5" r="2" fill="#687179"></circle>
                                    <circle cx="12" cy="12" r="2" fill="#687179"></circle>
                                    <circle cx="12" cy="19" r="2" fill="#687179"></circle>
                                </svg>
                            </button>
                            <div class="dropdown-menu">
                                <a href="edir-audit.html?id=${auditoria.id}" class="edit-link">Editar</a>
                            </div>
                        </div>
                    </td>
                `;
                
                tbody.appendChild(tr);
            });
        }

        // Garantir que os dropdowns sejam inicializados corretamente
        setTimeout(() => {
            if (typeof window.initializeDropdowns === 'function') {
                window.initializeDropdowns();
            }
        }, 200);
    }
});

// Função para inicializar os dropdowns
function initDropdowns() {
    // Encontrar todos os botões de dropdown
    const toggleButtons = document.querySelectorAll('.dropdown-toggle');
    
    // Adicionar handlers de clique a cada botão
    toggleButtons.forEach(button => {
        button.removeEventListener('click', handleDropdownClick);
        button.addEventListener('click', handleDropdownClick);
    });
    
    // Adicionar listener global para fechar dropdowns ao clicar fora
    document.removeEventListener('click', closeDropdowns);
    document.addEventListener('click', closeDropdowns);
}

// Função para lidar com cliques nos botões de dropdown
function handleDropdownClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Obter o menu dropdown relacionado
    const dropdown = this.closest('.dropdown');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    // Fechar todos os outros dropdowns primeiro
    document.querySelectorAll('.dropdown').forEach(d => {
        if (d !== dropdown && d.classList.contains('active')) {
            d.classList.remove('active');
            d.querySelector('.dropdown-menu').style.display = 'none';
        }
    });
    
    // Alternar o estado do dropdown atual
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
        dropdown.classList.remove('active');
    } else {
        // Posicionar corretamente o menu
        positionDropdownMenu(this, menu);
        dropdown.classList.add('active');
    }
}

// Função para posicionar o menu dropdown corretamente
function positionDropdownMenu(button, menu) {
    // Obter as dimensões e posição do botão
    const buttonRect = button.getBoundingClientRect();
    
    // Configurar o menu para ser visível
    menu.style.display = 'block';
    menu.style.position = 'absolute';
    menu.style.right = '0';
    menu.style.top = (buttonRect.height + 5) + 'px';
    menu.style.zIndex = '1000';
}

// Função para fechar todos os dropdowns abertos ao clicar fora
function closeDropdowns(e) {
    if (!e.target.closest('.dropdown-toggle')) {
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
            dropdown.querySelector('.dropdown-menu').style.display = 'none';
        });
    }
}

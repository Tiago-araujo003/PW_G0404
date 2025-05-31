// Peritos disponíveis para alocação
const peritosData = [
    { 
        id: 1, 
        name: 'João Pereira', 
        speciality: 'Infraestrutura Rodoviária', 
        avatar: '../Assets/avatar-joao.jpg',
        available: true,
        email: 'joao.pereira@example.com',
        phone: '+351 923 456 789'
    },
    { 
        id: 2, 
        name: 'Ana Silva', 
        speciality: 'Eletricidade e Iluminação', 
        avatar: '../Assets/avatar-ana.jpg',
        available: true,
        email: 'ana.silva@example.com',
        phone: '+351 912 345 678'
    },
    { 
        id: 3, 
        name: 'Manuel Santos', 
        speciality: 'Infraestrutura Urbana', 
        avatar: '../Assets/avatar-manuel.jpg',
        available: false,
        email: 'manuel.santos@example.com',
        phone: '+351 934 567 890'
    }
];

// Materiais para demonstração
const materiaisData = [
    { id: 1, name: 'Tinta Acrílica', quantity: '5 L', status: 'Usado' },
    { id: 2, name: 'Cimento Portland', quantity: '25 kg', status: 'Usado' },
    { id: 3, name: 'Areia', quantity: '50 kg', status: 'Usado' }
];

// Variável para armazenar o perito selecionado
let selectedPeritoData = null;

// Função executada quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar o status do relatório
    checkReportStatus();
    
    // Recuperar perito salvo do localStorage
    loadSavedPerito();
    
    // Carregar criticidade salva
    loadSavedCriticality();
    
    console.log("Script de alocação de peritos carregado");
});

// Verifica o status do relatório e configura a interface apropriada
function checkReportStatus() {
    // Verificar ID do relatório na URL
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('id') || '876364';
    
    // Relatórios resolvidos (para demonstração)
    const resolvedReportIds = ['876369', '876370', '876371', '889101'];
    
    // Verificar se este é um relatório resolvido
    if (resolvedReportIds.includes(reportId)) {
        console.log('Relatório resolvido encontrado:', reportId);
        showResolvedInterface();
    } else {
        console.log('Relatório pendente encontrado:', reportId);
        showPendingInterface();
    }
}

// Mostra interface para relatórios pendentes
function showPendingInterface() {
    // Esconder elementos que só aparecem para relatórios resolvidos
    document.querySelectorAll('.resolved-only').forEach(el => {
        el.style.display = 'none';
    });
    
    // Mostrar elementos para relatórios pendentes
    document.getElementById('pending-allocation').style.display = 'block';
    
    // Configurar o botão "Selecionar Perito"
    const selectButton = document.getElementById('select-perito-button');
    if (selectButton) {
        selectButton.onclick = openPeritoSelector;
        selectButton.style.cursor = 'pointer';
        console.log('Botão de seleção de perito configurado:', selectButton);
    }
    
    // Habilitar os botões de ação
    document.querySelectorAll('.action-button').forEach(button => {
        button.disabled = !selectedPeritoData; // Desabilitado se não houver perito selecionado
    });
}

// Mostra interface para relatórios resolvidos
function showResolvedInterface() {
    // Esconder elementos que só aparecem para relatórios pendentes
    document.getElementById('pending-allocation').style.display = 'none';
    document.getElementById('action-buttons').style.display = 'none';
    
    // Mostrar elementos para relatórios resolvidos
    document.getElementById('resolved-allocation').style.display = 'block';
    document.getElementById('materiais-allocation').style.display = 'block';
    document.getElementById('status-message').style.display = 'block';
    document.getElementById('view-report-button').style.display = 'block';
    
    // Preencher informações do perito alocado (para demonstração ou do perito salvo)
    const perito = selectedPeritoData || peritosData[0];
    document.getElementById('resolved-perito-avatar').src = perito.avatar;
    document.getElementById('resolved-perito-name').textContent = perito.name;
    document.getElementById('resolved-perito-speciality').textContent = perito.speciality;
    document.getElementById('resolved-perito-contact').textContent = `${perito.email} | ${perito.phone}`;
    
    // Preencher tabela de materiais
    const tbody = document.getElementById('materiais-tbody');
    tbody.innerHTML = '';
    
    materiaisData.forEach(material => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${material.name}</td>
            <td>${material.quantity}</td>
            <td>${material.status}</td>
        `;
        tbody.appendChild(row);
    });
}

// Carrega o perito salvo do localStorage
function loadSavedPerito() {
    // Obter o ID do relatório atual
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('id') || '876364';
    
    // Tentar recuperar o perito salvo para este relatório
    const savedPeritoJson = localStorage.getItem(`report_${reportId}_perito`);
    
    if (savedPeritoJson) {
        try {
            selectedPeritoData = JSON.parse(savedPeritoJson);
            console.log('Perito recuperado do localStorage:', selectedPeritoData);
            
            // Atualizar a interface
            if (selectedPeritoData) {
                // Se estamos na interface pendente, mostrar o perito selecionado
                if (document.getElementById('pending-allocation').style.display !== 'none') {
                    document.querySelector('.perito-selection-pending').style.display = 'none';
                    
                    const selectedInfo = document.getElementById('selected-perito-info');
                    selectedInfo.style.display = 'flex';
                    
                    // Preencher as informações do perito
                    document.getElementById('selected-perito-avatar').src = selectedPeritoData.avatar;
                    document.getElementById('selected-perito-name').textContent = selectedPeritoData.name;
                    document.getElementById('selected-perito-speciality').textContent = selectedPeritoData.speciality;
                    document.getElementById('selected-perito-contact').textContent = `${selectedPeritoData.email} | ${selectedPeritoData.phone}`;
                    
                    // Habilitar os botões de ação
                    document.querySelectorAll('.action-button').forEach(button => {
                        button.disabled = false;
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao carregar perito do localStorage:', error);
        }
    }
}

// Abre o modal para selecionar peritos
function openPeritoSelector() {
    console.log('Abrindo seletor de peritos');
    
    // Criar o modal de seleção de peritos
    const modal = document.createElement('div');
    modal.className = 'perito-modal';
    modal.id = 'perito-modal';
    modal.style.display = 'flex';
    
    // Conteúdo do modal
    modal.innerHTML = `
        <div class="perito-modal-content">
            <div class="perito-modal-header">
                <h3>Selecionar Perito</h3>
                <span class="close-modal" onclick="closePeritoSelector()">&times;</span>
            </div>
            <div class="peritos-list" id="peritos-list">
                <!-- Lista de peritos será inserida aqui -->
            </div>
        </div>
    `;
    
    // Adicionar o modal ao corpo do documento
    document.body.appendChild(modal);
    
    // Preencher a lista de peritos disponíveis
    const peritosList = document.getElementById('peritos-list');
    
    peritosData.filter(p => p.available).forEach(perito => {
        const peritoItem = document.createElement('div');
        peritoItem.className = 'perito-item';
        peritoItem.dataset.peritoId = perito.id;
        
        peritoItem.innerHTML = `
            <img src="${perito.avatar}" alt="${perito.name}" class="perito-avatar">
            <div class="perito-item-details">
                <div class="perito-name">${perito.name}</div>
                <div class="perito-speciality">${perito.speciality}</div>
                <div class="perito-availability available">Disponível</div>
            </div>
        `;
        
        // Adicionar evento de clique
        peritoItem.addEventListener('click', function() {
            selectPerito(perito.id);
        });
        
        peritosList.appendChild(peritoItem);
    });
    
    // Adicionar evento de fechar ao clicar fora do modal
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closePeritoSelector();
        }
    });
}

// Fecha o modal de seleção de peritos
function closePeritoSelector() {
    const modal = document.getElementById('perito-modal');
    if (modal) {
        modal.remove();
    }
}

// Seleciona um perito específico
function selectPerito(peritoId) {
    // Encontrar o perito pelo ID
    const perito = peritosData.find(p => p.id === peritoId);
    
    if (!perito) return;
    
    console.log('Perito selecionado:', perito.name);
    
    // Guardar o perito selecionado na variável global
    selectedPeritoData = perito;
    
    // Salvar o perito selecionado no localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('id') || '876364';
    localStorage.setItem(`report_${reportId}_perito`, JSON.stringify(perito));
    
    // Atualizar a interface para mostrar o perito selecionado
    document.querySelector('.perito-selection-pending').style.display = 'none';
    
    const selectedInfo = document.getElementById('selected-perito-info');
    selectedInfo.style.display = 'flex';
    
    // Preencher as informações do perito
    document.getElementById('selected-perito-avatar').src = perito.avatar;
    document.getElementById('selected-perito-name').textContent = perito.name;
    document.getElementById('selected-perito-speciality').textContent = perito.speciality;
    document.getElementById('selected-perito-contact').textContent = `${perito.email} | ${perito.phone}`;
    
    // Habilitar os botões de ação
    document.querySelectorAll('.action-button').forEach(button => {
        button.disabled = false;
    });
    
    // Fechar o modal
    closePeritoSelector();
}

// Resetar a seleção de perito
function resetPeritoSelection() {
    // Limpar o perito selecionado
    selectedPeritoData = null;
    
    // Remover do localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('id') || '876364';
    localStorage.removeItem(`report_${reportId}_perito`);
    
    // Atualizar a interface
    document.querySelector('.perito-selection-pending').style.display = 'block';
    document.getElementById('selected-perito-info').style.display = 'none';
    
    // Desabilitar os botões de ação
    document.querySelectorAll('.action-button').forEach(button => {
        button.disabled = true;
    });
}

// Submeter ação (aprovar/rejeitar)
function submitAction(action) {
    if (!selectedPeritoData) {
        alert('Por favor, selecione um perito antes de continuar.');
        return;
    }
    
    const actionText = action === 'approve' ? 'aprovado' : 'rejeitado';
    
    // Salvar o status do relatório
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('id') || '876364';
    localStorage.setItem(`report_${reportId}_status`, action === 'approve' ? 'resolved' : 'rejected');
    
    // Mostrar mensagem de sucesso
    alert(`Relatório ${actionText} com sucesso! Perito ${selectedPeritoData.name} foi alocado.`);
    
    // Atualizar interface para mostrar relatório resolvido
    showResolvedInterface();
}

// Função para atualizar a criticidade do relatório
function updateReportCriticality() {
    const selectElement = document.getElementById('criticality-select');
    const selectedValue = selectElement.value;
    
    // Obter o ID do relatório
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('id') || '876364';
    
    // Salvar no localStorage
    localStorage.setItem(`report_${reportId}_criticality`, selectedValue);
    
    // Atualizar a exibição atual
    updateCriticalityDisplay(selectedValue);
    
    // Mostrar mensagem de sucesso
    alert(`Criticidade atualizada para ${selectedValue}`);
}

// Atualizar a exibição da criticidade
function updateCriticalityDisplay(level) {
    const criticalityElement = document.getElementById('current-criticality');
    
    if (!criticalityElement) return;
    
    const criticalityLabels = {
        '1': 'Baixo',
        '2': 'Moderado',
        '3': 'Médio',
        '4': 'Alto',
        '5': 'Muito Alto'
    };
    
    criticalityElement.innerHTML = `
        <span class="criticality-badge level-${level}">${level}</span>
        <span class="criticality-label">${criticalityLabels[level]}</span>
    `;
}

// Função para carregar criticidade salva
function loadSavedCriticality() {
    // Obter o ID do relatório atual
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('id') || '876364';
    
    // Tentar recuperar a criticidade salva para este relatório
    const savedCriticality = localStorage.getItem(`report_${reportId}_criticality`) || '3'; // Default para 3 - Médio
    
    // Atualizar select
    const selectElement = document.getElementById('criticality-select');
    if (selectElement) {
        selectElement.value = savedCriticality;
    }
    
    // Atualizar exibição
    updateCriticalityDisplay(savedCriticality);
}

// Tornar funções disponíveis globalmente
window.openPeritoSelector = openPeritoSelector;
window.closePeritoSelector = closePeritoSelector;
window.selectPerito = selectPerito;
window.resetPeritoSelection = resetPeritoSelection;
window.submitAction = submitAction;
window.updateReportCriticality = updateReportCriticality;

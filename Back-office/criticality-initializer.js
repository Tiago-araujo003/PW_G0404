document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando script de criticidade');
    
    // Tentar inicializar imediatamente
    initializeCriticality();
    
    // Tentar novamente após um pequeno atraso para garantir que os elementos estejam carregados
    setTimeout(initializeCriticality, 500);
});

// Função para inicializar a funcionalidade de criticidade
function initializeCriticality() {
    console.log('Inicializando funcionalidade de criticidade');
    
    // Verificar se os elementos existem
    const criticalitySection = document.getElementById('criticality-section');
    const currentCriticality = document.getElementById('current-criticality');
    const criticalitySelect = document.getElementById('criticality-select');
    const criticalityButton = document.querySelector('.criticality-button');
    
    // Debug - verificar se os elementos foram encontrados
    console.log('Seção de criticidade:', criticalitySection);
    console.log('Exibição atual:', currentCriticality);
    console.log('Seletor:', criticalitySelect);
    console.log('Botão:', criticalityButton);
    
    // Se algum elemento estiver faltando, adicionar um aviso no console
    if (!criticalitySection || !currentCriticality || !criticalitySelect || !criticalityButton) {
        console.warn('Elementos de criticidade não encontrados. Verificar HTML.');
        return;
    }
    
    // Garantir que a seção de criticidade esteja visível
    criticalitySection.style.display = 'block';
    
    // Labels de criticidade
    const criticalityLabels = {
        '1': 'Baixo',
        '2': 'Moderado',
        '3': 'Médio',
        '4': 'Alto',
        '5': 'Muito Alto'
    };
    
    // Obter o ID do relatório atual
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('id') || '876364';
    
    // Carregar criticidade salva ou usar valor padrão
    const savedCriticality = localStorage.getItem(`report_${reportId}_criticality`) || '3';
    
    // Renderizar a criticidade atual
    function renderCriticality(level) {
        currentCriticality.innerHTML = `
            <span class="criticality-badge level-${level}">${level}</span>
            <span class="criticality-label">${criticalityLabels[level]}</span>
        `;
        
        // Debug - verificar o HTML renderizado
        console.log('HTML renderizado:', currentCriticality.innerHTML);
    }
    
    // Atualizar a interface com a criticidade salva
    renderCriticality(savedCriticality);
    criticalitySelect.value = savedCriticality;
    
    // Função para atualizar a criticidade
    function updateCriticality(event) {
        // Prevenir o comportamento padrão do formulário (impedir o envio e recarregamento da página)
        if (event) {
            event.preventDefault();
        }
        
        const selectedValue = criticalitySelect.value;
        
        // Salvar no localStorage
        localStorage.setItem(`report_${reportId}_criticality`, selectedValue);
        
        // Atualizar a exibição
        renderCriticality(selectedValue);
        
        console.log('Criticidade atualizada para:', selectedValue);
        
        // Feedback visual - usar uma notificação mais suave
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.backgroundColor = '#4caf50';
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        notification.style.zIndex = '1000';
        notification.textContent = `Criticidade atualizada para ${selectedValue} - ${criticalityLabels[selectedValue]}`;
        
        document.body.appendChild(notification);
        
        // Remover a notificação após 3 segundos
        setTimeout(function() {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
        
        // Retornar false para garantir que o formulário não seja enviado
        return false;
    }
    
    // Adicionar o manipulador de eventos para o botão
    criticalityButton.addEventListener('click', updateCriticality);
    
    // Adicionando função global com proteção
    window.updateReportCriticality = function(event) {
        if (event) {
            event.preventDefault();
        }
        return updateCriticality();
    }
}

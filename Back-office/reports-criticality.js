// Função para atualizar as criticidades na tabela de reports
function updateReportCriticalities() {
    console.log('Atualizando criticidades na tabela de reports');
    
    // Encontrar todas as linhas na tabela de reports
    const reportRows = document.querySelectorAll('.reports-table tbody tr');
    
    reportRows.forEach(row => {
        // Obter o ID do report da primeira célula (removendo o #)
        const idCell = row.querySelector('td:first-child');
        if (!idCell) return;
        
        const reportId = idCell.textContent.trim().replace('#', '');
        console.log('Verificando report ID:', reportId);
        
        // Obter a criticidade salva no localStorage
        const savedCriticality = localStorage.getItem(`report_${reportId}_criticality`);
        console.log('Criticidade salva:', savedCriticality);
        
        if (!savedCriticality) return;
        
        // Encontrar a célula de criticidade (quinta coluna)
        const criticalityCell = row.querySelector('td:nth-child(5)');
        if (!criticalityCell) return;
        
        // Obter o elemento badge dentro da célula
        const badge = criticalityCell.querySelector('.criticality-badge');
        if (badge) {
            // Atualizar o nível e texto do badge
            badge.textContent = savedCriticality;
            
            // Remover todas as classes de nível existentes
            badge.classList.remove('level-1', 'level-2', 'level-3', 'level-4', 'level-5');
            
            // Adicionar a classe de nível correta
            badge.classList.add(`level-${savedCriticality}`);
            
            console.log(`Badge atualizado para nível ${savedCriticality}`);
        }
    });
}

// Executar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando sincronização de criticidade');
    
    // Atualizar imediatamente
    updateReportCriticalities();
    
    // Configurar intervalo para verificar atualizações a cada 2 segundos
    setInterval(updateReportCriticalities, 2000);
    
    // Também atualizar quando a página receber foco
    window.addEventListener('focus', function() {
        console.log('Página recebeu foco, atualizando criticidades');
        updateReportCriticalities();
    });
    
    // E quando a página se tornar visível
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            console.log('Página visível, atualizando criticidades');
            updateReportCriticalities();
        }
    });
});

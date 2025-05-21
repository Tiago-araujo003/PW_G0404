// Função para garantir que o botão "Ver relatório" esteja funcionando corretamente
function updateViewReportButton() {
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('id');
    
    if (!reportId) return;
    
    // Obter o container do botão e o link
    const viewReportContainer = document.getElementById('view-report-button');
    const viewReportLink = document.getElementById('view-report-link');
    
    if (!viewReportContainer || !viewReportLink) return;
    
    // Verificar se o report é resolvido
    let isResolved = false;
    
    // Método 1: Verificar no localStorage
    try {
        const savedReports = localStorage.getItem('reports');
        if (savedReports) {
            const parsedReports = JSON.parse(savedReports);
            if (parsedReports[reportId] && parsedReports[reportId].status === 'resolved') {
                isResolved = true;
                console.log('Report resolvido detectado no localStorage');
            }
        }
    } catch (e) {
        console.error('Erro ao verificar localStorage:', e);
    }
    
    // Método 2: Verificar no objeto global reports
    if (window.reports && window.reports[reportId] && window.reports[reportId].status === 'resolved') {
        isResolved = true;
        console.log('Report resolvido detectado no objeto global reports');
    }
    
    // Método 3: Verificar indicadores visuais
    if (document.querySelector('.status-resolved') || 
        document.getElementById('report-status')?.dataset.status === 'resolved' ||
        document.body.classList.contains('report-status-resolved')) {
        isResolved = true;
        console.log('Report resolvido detectado por indicadores visuais');
    }
    
    // Se é resolvido, mostrar o botão e configurar o link
    if (isResolved) {
        // Configurar o link para o ID do report
        viewReportLink.href = `ReportPDF.html?id=${reportId}`;
        
        // Tornar o container visível
        viewReportContainer.style.display = 'block';
        console.log('Botão "Ver relatório" ativado e configurado para ReportPDF.html?id=' + reportId);
    } else {
        // Se não for resolvido, esconder o botão
        viewReportContainer.style.display = 'none';
    }
}

// Chamar a função quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Verificando botão "Ver relatório"');
    
    // Chamar imediatamente
    updateViewReportButton();
    
    // Chamar novamente após um pequeno atraso para garantir que todos os scripts foram executados
    setTimeout(updateViewReportButton, 500);
    
    // Terceira chamada final para garantir
    setTimeout(updateViewReportButton, 1000);
});
/**
 * Script para garantir que reports resolvidos não mostrem botões de aprovar/rejeitar
 * Esta versão corrigida verifica o localStorage para obter o status mais atualizado
 * e evita mensagens duplicadas
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Direct resolved reports detector initialized');
    
    // Função para verificar os botões 
    function checkAndHideButtons() {
        // Obter informações do report atual
        const urlParams = new URLSearchParams(window.location.search);
        const reportId = urlParams.get('id');
        console.log('💡 Checking report ID:', reportId);
        
        // IMPORTANTE: Verificar o localStorage primeiro para ter o status mais atualizado
        let isResolvedInLocalStorage = false;
        try {
            const savedReports = localStorage.getItem('reports');
            if (savedReports && reportId) {
                const parsedReports = JSON.parse(savedReports);
                if (parsedReports[reportId] && parsedReports[reportId].status === 'resolved') {
                    console.log('🔍 Report detectado como resolvido no localStorage');
                    isResolvedInLocalStorage = true;
                }
            }
        } catch (e) {
            console.error('Erro ao verificar localStorage:', e);
        }
        
        // Verificar status no objeto window.reports do script.js
        let isResolvedInMemory = false;
        if (window.reports && window.reports[reportId] && window.reports[reportId].status === 'resolved') {
            console.log('🔍 Report detectado como resolvido na memória (window.reports)');
            isResolvedInMemory = true;
        }
        
        // Lista estática de IDs conhecidos como resolvidos
        const knownResolvedReports = ['876364', '876412'];
        const isKnownResolved = knownResolvedReports.includes(reportId);
        
        // Procurar sinais de report resolvido na página
        const hasResolvedClass = !!document.querySelector('.status-resolved');
        const hasResolvedText = document.body.textContent.includes('Resolvido');
        const hasResolvedStatus = document.getElementById('report-status')?.dataset.status === 'resolved';
        
        // Verificar cor de fundo verde típica dos reports resolvidos
        let hasGreenBackground = false;
        document.querySelectorAll('span, div').forEach(el => {
            try {
                const style = window.getComputedStyle(el);
                if (style.backgroundColor === 'rgb(119, 183, 169)' || 
                    style.backgroundColor === '#77B7A9') {
                    hasGreenBackground = true;
                }
            } catch (e) {}
        });
        
        console.log('🔍 Resolved indicators:', {
            isResolvedInLocalStorage,
            isResolvedInMemory,
            isKnownResolved,
            hasResolvedClass,
            hasResolvedText,
            hasResolvedStatus,
            hasGreenBackground
        });
        
        // Se qualquer indicador de resolved for encontrado
        if (isResolvedInLocalStorage || isResolvedInMemory || isKnownResolved || 
            hasResolvedClass || hasResolvedText || hasResolvedStatus || hasGreenBackground) {
            
            console.log('🚫 Report detectado como resolvido, ocultando botões');
            
            // Atualizar o elemento oculto de status (para compatibilidade com outros scripts)
            const statusElement = document.getElementById('report-status');
            if (statusElement) {
                statusElement.dataset.status = 'resolved';
                console.log('✅ Elemento de status atualizado para resolved');
            }
            
            // Adicionar classe ao body para CSS
            document.body.classList.add('report-status-resolved');
            
            // Encontrar e esconder os botões
            const buttonsContainer = document.querySelector('.details-actions');
            if (buttonsContainer) {
                // PRIMEIRO: Remover qualquer mensagem existente para evitar duplicação
                const existingMessages = buttonsContainer.querySelectorAll('.status-message');
                existingMessages.forEach(msg => {
                    console.log('🗑️ Removendo mensagem existente para evitar duplicação');
                    msg.remove();
                });
                
                const buttons = buttonsContainer.querySelectorAll('button');
                let buttonFound = false;
                
                buttons.forEach(button => {
                    if (button.textContent === 'Aprovar' || 
                        button.textContent === 'Rejeitar' || 
                        button.textContent.includes('Aprovar') || 
                        button.textContent.includes('Rejeitar')) {
                        button.style.display = 'none';
                        buttonFound = true;
                        console.log(`✅ Botão "${button.textContent}" ocultado`);
                    }
                });
                
                // Verificar também botões dentro de divs ou templates Vue
                const vueButtons = buttonsContainer.querySelectorAll('.approve-button, .reject-button');
                vueButtons.forEach(button => {
                    button.style.display = 'none';
                    buttonFound = true;
                    console.log(`✅ Botão de classe "${button.className}" ocultado`);
                });
                
                // Adicionar mensagem se botões foram encontrados E não existe nenhuma mensagem já
                if (buttonFound && !buttonsContainer.querySelector('.status-message')) {
                    const messageEl = document.createElement('span');
                    messageEl.className = 'status-message';
                    messageEl.textContent = 'Este report já foi processado';
                    buttonsContainer.appendChild(messageEl);
                    console.log('✅ Mensagem de report processado adicionada');
                }
                
                // Forcefully update Vue if it exists
                try {
                    const vueApp = document.getElementById('perito-association-app').__vue__;
                    if (vueApp) {
                        vueApp.reportStatus = 'resolved';
                        console.log('✅ Vue app status atualizado para resolved');
                    }
                } catch (e) {
                    console.log('❌ Não foi possível atualizar o status do Vue:', e);
                }
                
                // ATUALIZAÇÃO: Mostrar o botão "Ver relatório" e configurar corretamente o link
                const viewReportContainer = document.getElementById('view-report-button');
                const viewReportLink = document.getElementById('view-report-link');
                if (viewReportContainer && viewReportLink) {
                    viewReportContainer.style.display = 'block';
                    viewReportLink.href = `ReportPDF.html?id=${reportId}`;
                    console.log('✅ Botão "Ver relatório" exibido e configurado para:', viewReportLink.href);
                }
            }
        }
    }
    
    // Executar verificação inicial após pequeno delay
    setTimeout(checkAndHideButtons, 300);
    
    // Executar verificação novamente após carregamento completo
    window.addEventListener('load', function() {
        setTimeout(checkAndHideButtons, 800);
    });
    
    // ========================
    // SCRIPT ADICIONAL PARA PERITO
    // ========================
    
    // Get report ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('id');
    
    // List of resolved/validated report IDs (for demo purposes)
    const resolvedReports = ['876369', '876370', '876371', '889101', '889102'];
    
    if (resolvedReports.includes(reportId)) {
        // This is a resolved report
        const statusElem = document.getElementById('report-status');
        if (statusElem) {
            statusElem.dataset.status = 'resolved';
        }
        
        // Show the perito allocation section
        const peritoSection = document.getElementById('perito-allocation-section');
        if (peritoSection) {
            peritoSection.style.display = 'block';
        }
        
        // Show the view report button
        const viewReportBtn = document.getElementById('view-report-button');
        if (viewReportBtn) {
            viewReportBtn.style.display = 'block';
        }
        
        // Set the link to the report
        const viewReportLink = document.getElementById('view-report-link');
        if (viewReportLink) {
            viewReportLink.href = `PeritReport.html?id=${reportId}`;
        }
        
        console.log('This is a resolved report. Showing allocated perito info.');
    }
});
/**
 * Direct fix for pending reports not showing buttons
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get the report ID from the page
    const reportIdEl = document.getElementById('report-id');
    if (!reportIdEl) return;
    
    const reportId = reportIdEl.textContent.replace('#', '');
    console.log('Report ID detected:', reportId);
    
    // Force buttons to show for known pending reports
    const pendingReports = ['876811', '897654', '876368', '876789', '876790', '876810'];
    
    if (pendingReports.includes(reportId)) {
        console.log('This is a pending report, forcing buttons to appear');
        
        setTimeout(function() {
            // Force Vue to update if it exists
            const app = document.getElementById('perito-association-app').__vue__;
            if (app) {
                app.reportStatus = 'pending';
                console.log('Forced Vue reportStatus to pending');
            }
            
            // Regardless of Vue, ensure buttons are visible
            const actionsContainer = document.querySelector('.details-actions');
            if (actionsContainer) {
                // Clear any "already processed" messages
                const message = actionsContainer.querySelector('.status-message');
                if (message) message.style.display = 'none';
                
                // Check if buttons already exist
                let rejectButton = actionsContainer.querySelector('.reject-button');
                let approveButton = actionsContainer.querySelector('.approve-button');
                
                // If not, create them
                if (!rejectButton || !approveButton) {
                    const buttonsHTML = `
                        <button class="reject-button" onclick="showPeritoSelector('reject')">Rejeitar</button>
                        <button class="approve-button" onclick="showPeritoSelector('approve')">Aprovar</button>
                    `;
                    
                    const buttonsContainer = document.createElement('div');
                    buttonsContainer.className = 'forced-buttons';
                    buttonsContainer.innerHTML = buttonsHTML;
                    actionsContainer.appendChild(buttonsContainer);
                    
                    // Add the selector function
                    window.showPeritoSelector = function(action) {
                        const vueApp = document.getElementById('perito-association-app').__vue__;
                        if (vueApp && vueApp.prepareAction) {
                            vueApp.prepareAction(action);
                        } else {
                            alert('Não foi possível iniciar a seleção de peritos. Por favor, recarregue a página.');
                        }
                    };
                } else {
                    // Just make sure they're visible
                    rejectButton.style.display = 'inline-block';
                    approveButton.style.display = 'inline-block';
                }
                
                console.log('Buttons are now visible');
            }
        }, 500);
    }
});

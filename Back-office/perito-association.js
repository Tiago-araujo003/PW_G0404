// Component template for the perito selector
Vue.component('perito-selector', {
    props: ['peritos'],
    data() {
        return {
            selectedPerito: null
        };
    },
    template: `
        <div class="perito-selector">
            <h3>Selecione um Perito para este Report</h3>
            <div class="perito-list">
                <div v-for="perito in peritos" :key="perito.id" 
                     class="perito-item" 
                     :class="{ 'selected': selectedPerito === perito.id }"
                     @click="selectPerito(perito.id)">
                    <img :src="perito.avatar" alt="Avatar" class="perito-avatar">
                    <div class="perito-info">
                        <div class="perito-name">{{ perito.name }}</div>
                        <div class="perito-speciality">{{ perito.speciality }}</div>
                    </div>
                </div>
            </div>
            <div class="perito-actions">
                <button class="cancel-button" @click="cancel">Cancelar</button>
                <button class="confirm-button" @click="confirm" :disabled="!selectedPerito">Confirmar</button>
            </div>
        </div>
    `,
    methods: {
        selectPerito(peritoId) {
            this.selectedPerito = peritoId;
        },
        confirm() {
            if (this.selectedPerito) {
                this.$emit('select-perito', this.selectedPerito);
            }
        },
        cancel() {
            this.$emit('cancel');
        }
    }
});

// Main Vue instance
document.addEventListener('DOMContentLoaded', function() {
    new Vue({
        el: '#perito-association-app',
        data: {
            showSelector: false,
            pendingAction: null,
            reportStatus: 'pending', // Default to pending until determined
            availablePeritos: [
                { 
                    id: 1, 
                    name: 'Ana Silva', 
                    speciality: 'Mobilidade Urbana',
                    avatar: '../Assets/avatar-ana.jpg'
                },
                { 
                    id: 2, 
                    name: 'João Pereira', 
                    speciality: 'Infraestrutura Rodoviária',
                    avatar: '../Assets/avatar-joao.jpg'
                },
                { 
                    id: 3, 
                    name: 'Maria Santos', 
                    speciality: 'Sinalização de Trânsito',
                    avatar: '../Assets/avatar-maria.jpg'
                },
                { 
                    id: 4, 
                    name: 'Carlos Oliveira', 
                    speciality: 'Segurança Viária',
                    avatar: '../Assets/avatar-carlos.jpg'
                }
            ]
        },
        computed: {
            // Show buttons only for 'pending' or 'analysis' reports
            canModifyReport() {
                console.log("Current report status:", this.reportStatus);
                
                // If it's resolved, don't allow modification (check various forms)
                if (this.reportStatus === 'resolved' || 
                    this.reportStatus === 'resolvido' ||
                    this.reportStatus === 'aprovado' ||
                    this.reportStatus === 'accepted' ||
                    this.reportStatus === 'complete' ||
                    this.reportStatus === 'completed') {
                    return false;
                }
                
                // Only allow pending/analysis reports to be modified
                return this.reportStatus === 'pending' || 
                       this.reportStatus === 'pendente' ||
                       this.reportStatus === 'analysis' || 
                       this.reportStatus === 'em análise';
            }
        },
        mounted() {
            console.log("Vue component mounted, checking report status");
            
            // Primeiro: remover mensagens duplicadas existentes (se houver)
            this.removeDuplicateMessages();
            
            // Obter o ID do report da URL
            const urlParams = new URLSearchParams(window.location.search);
            const reportId = urlParams.get('id');
            
            // Verificação completa do status, priorizando localStorage
            this.detectReportStatus(reportId);
            
            // Verificação final após carregamento completo da página
            setTimeout(() => {
                this.removeDuplicateMessages();
                this.detectReportStatus(reportId);
                console.log("Final status after verification:", this.reportStatus);
                console.log("Can modify report:", this.canModifyReport);
            }, 500);
        },
        methods: {
            // Nova função para remover mensagens duplicadas
            removeDuplicateMessages() {
                const buttonsContainer = document.querySelector('.details-actions');
                if (buttonsContainer) {
                    const statusMessages = buttonsContainer.querySelectorAll('.status-message');
                    // Se há mais de uma mensagem, deixar apenas a primeira
                    if (statusMessages.length > 1) {
                        console.log(`Removendo ${statusMessages.length - 1} mensagens duplicadas`);
                        for (let i = 1; i < statusMessages.length; i++) {
                            statusMessages[i].remove();
                        }
                    }
                }
            },
            
            detectReportStatus(reportId) {
                if (!reportId) return;
                
                // 1. VERIFICAÇÃO PRIORITÁRIA: localStorage (web storage)
                // A verificação mais confiável é o localStorage, que mantém o estado entre navegações
                try {
                    const savedReports = localStorage.getItem('reports');
                    if (savedReports) {
                        const parsedReports = JSON.parse(savedReports);
                        if (parsedReports[reportId] && parsedReports[reportId].status === 'resolved') {
                            console.log("Report confirmado como resolvido no localStorage");
                            this.reportStatus = 'resolved';
                            
                            // Mostrar o botão Ver Relatório se o report estiver resolvido
                            this.showViewReportButton(reportId);
                            
                            return;
                        }
                    }
                } catch (error) {
                    console.error("Erro ao verificar localStorage:", error);
                }
                
                // 2. Verificação do objeto global reports (do script.js)
                if (window.reports && window.reports[reportId]) {
                    if (window.reports[reportId].status === 'resolved') {
                        console.log("Report confirmado como resolvido no objeto global reports");
                        this.reportStatus = 'resolved';
                        this.showViewReportButton(reportId);
                        return;
                    }
                }
                
                // 3. Lista de IDs conhecidos como resolvidos
                const resolvedReportIds = ['876364', '876412'];
                if (resolvedReportIds.includes(reportId)) {
                    console.log(`Report ID ${reportId} é conhecido como resolvido`);
                    this.reportStatus = 'resolved';
                    this.showViewReportButton(reportId);
                    return;
                }
                
                // 4. Verificação por indicadores visuais
                if (this.checkVisualStatusIndicators()) {
                    this.showViewReportButton(reportId);
                    return; // Status já definido pela função
                }
                
                // 5. Verificação por classe no body
                if (document.body.classList.contains('report-status-resolved')) {
                    console.log("Body tem classe de report resolvido");
                    this.reportStatus = 'resolved';
                    this.showViewReportButton(reportId);
                    return;
                }
                
                // 6. Verificar elemento oculto com o status
                const statusElement = document.getElementById('report-status');
                if (statusElement && 
                   (statusElement.dataset.status === 'resolved' || 
                    statusElement.dataset.status === 'resolvido')) {
                    console.log("Elemento oculto indica report resolvido");
                    this.reportStatus = 'resolved';
                    this.showViewReportButton(reportId);
                    return;
                }
            },
            
            // Nova função para mostrar e configurar o botão "Ver relatório"
            showViewReportButton(reportId) {
                if (!reportId) return;
                
                const viewReportContainer = document.getElementById('view-report-button');
                const viewReportLink = document.getElementById('view-report-link');
                
                if (viewReportContainer && viewReportLink) {
                    // Configurar o link para o report atual
                    viewReportLink.href = `ReportPDF.html?id=${reportId}`;
                    
                    // Mostrar o botão
                    viewReportContainer.style.display = 'block';
                    
                    console.log("Botão 'Ver relatório' configurado para:", viewReportLink.href);
                }
            },
            
            checkVisualStatusIndicators() {
                // Procurar por elementos com classe status-resolved
                if (document.querySelector('.status-resolved')) {
                    console.log("Encontrado elemento com classe .status-resolved");
                    this.reportStatus = 'resolved';
                    return true;
                }
                
                // Procurar elementos com texto "Resolvido" 
                const allElements = document.querySelectorAll('*');
                for (const el of allElements) {
                    if (el.textContent && el.textContent.trim() === 'Resolvido') {
                        console.log("Encontrado elemento com texto 'Resolvido'");
                        this.reportStatus = 'resolved';
                        return true;
                    }
                }
                
                // Procurar por elementos com fundo verde (típico de reports resolvidos)
                const pageElements = document.querySelectorAll('span, div, td');
                for (const el of pageElements) {
                    try {
                        const style = window.getComputedStyle(el);
                        const bgColor = style.backgroundColor;
                        if ((bgColor === 'rgb(119, 183, 169)' || bgColor === '#77B7A9') && 
                            el.textContent) {
                            console.log("Encontrado elemento com fundo verde:", el);
                            this.reportStatus = 'resolved';
                            return true;
                        }
                    } catch (e) {
                        // Ignorar erros
                    }
                }
                
                return false;
            },
            
            prepareAction(action) {
                this.pendingAction = action;
                this.showSelector = true;
            },
            
            assignPerito(peritoId) {
                const selectedPerito = this.availablePeritos.find(p => p.id === peritoId);
                const actionType = this.pendingAction === 'approve' ? 'aprovado' : 'rejeitado';
                
                // Get current report ID from URL
                const urlParams = new URLSearchParams(window.location.search);
                const reportId = urlParams.get('id');
                
                // In a real app, you'd send this data to your backend
                console.log(`Report ${reportId} ${actionType} e associado ao perito ${selectedPerito.name}`);
                
                // Update the status in localStorage to 'resolved' if approving
                if (this.pendingAction === 'approve' && reportId) {
                    try {
                        const savedReports = localStorage.getItem('reports');
                        if (savedReports) {
                            const parsedReports = JSON.parse(savedReports);
                            if (parsedReports[reportId]) {
                                // Update status to resolved
                                parsedReports[reportId].status = 'resolved';
                                // Save back to localStorage
                                localStorage.setItem('reports', JSON.stringify(parsedReports));
                                console.log(`Updated report ${reportId} status to resolved in localStorage`);
                            }
                        }
                    } catch (e) {
                        console.error("Error updating localStorage:", e);
                    }
                }
                
                // For demo purposes, show success message and redirect
                alert(`Report ${actionType} com sucesso e associado ao perito ${selectedPerito.name}`);
                
                // Reset state
                this.showSelector = false;
                this.pendingAction = null;
                
                // Redirect back to Reports.html instead of the missing Success page
                window.location.href = "Reports.html";
            },
            
            cancelSelection() {
                this.showSelector = false;
                this.pendingAction = null;
            }
        }
    });
    
    console.log("Vue app initialized for perito association");
});

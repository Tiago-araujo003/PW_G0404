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

// Main Vue instance with simplified approach
document.addEventListener('DOMContentLoaded', function() {
    // Create Vue app with simplified structure
    const app = new Vue({
        el: '#perito-association-app',
        data: {
            showSelector: false,
            pendingAction: null,
            reportStatus: 'pending', // Default to pending
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
                
                // Only allow pending/analysis reports to be modified - include Portuguese terms
                return this.reportStatus === 'pending' || 
                       this.reportStatus === 'pendente' ||
                       this.reportStatus === 'analysis' || 
                       this.reportStatus === 'em análise';
            }
        },
        mounted() {
            console.log("Vue component mounted");
            
            // SIMPLIFIED DETECTION - check for green "Resolvido" elements
            // This is the most reliable indicator of a resolved report
            const greenElements = document.querySelectorAll('.status-resolved');
            if (greenElements.length > 0) {
                console.log("Found .status-resolved element, marking as resolved");
                this.reportStatus = 'resolved';
            } else {
                console.log("No .status-resolved elements found");
            }
            
            // Check for Resolvido text with green background
            const allElements = document.querySelectorAll('span, div');
            for (const element of allElements) {
                try {
                    if (element.textContent && 
                        element.textContent.trim() === 'Resolvido') {
                        console.log("Found element with 'Resolvido' text:", element);
                        const style = window.getComputedStyle(element);
                        if (style.backgroundColor && 
                            (style.backgroundColor.includes("rgb(119, 183, 169)") || 
                             style.backgroundColor.includes("#77B7A9"))) {
                            console.log("Found Resolvido with correct background color");
                            this.reportStatus = 'resolved';
                            break;
                        }
                    }
                } catch (e) {
                    console.error("Error checking element:", e);
                }
            }
            
            // Check if any element has a green background color
            const possibleStatusElements = document.querySelectorAll('*');
            for (const element of possibleStatusElements) {
                try {
                    const style = window.getComputedStyle(element);
                    if (style.backgroundColor === "rgb(119, 183, 169)") {
                        console.log("Found element with green background color of resolved reports:", element);
                        this.reportStatus = 'resolved';
                        break;
                    }
                } catch (e) {
                    // Ignore errors
                }
            }
            
            // FALLBACK: Check report titles for indications of resolution
            const reportTitle = document.querySelector('#report-type');
            if (reportTitle) {
                console.log("Report title found:", reportTitle.textContent);
                // See if there's any resolved status indicator nearby
                const nearbyResolved = document.querySelector('.status-resolved');
                if (nearbyResolved) {
                    console.log("Found resolved status near report title");
                    this.reportStatus = 'resolved';
                }
            }
            
            // Additional check after a slight delay
            setTimeout(() => {
                if (document.body.textContent.includes("Resolvido")) {
                    console.log("Found 'Resolvido' text in document");
                    this.reportStatus = 'resolved';
                }
                console.log("Final status after delay:", this.reportStatus);
            }, 300);

            // Check for Portuguese "pendente" status indicators
            const statusElement = document.querySelector('.status-pending');
            if (statusElement && statusElement.textContent.includes('Pendente')) {
                this.reportStatus = 'pendente';
                console.log("Found 'Pendente' status indicator, setting status to pendente");
            }

            // Add explicit check for red status badge
            const redStatusBadges = document.querySelectorAll('span[style*="background-color: #E48698"], .status-pending');
            for (const badge of redStatusBadges) {
                if (badge.textContent.includes('Pendente')) {
                    this.reportStatus = 'pendente';
                    console.log("Found red Pendente badge");
                    break;
                }
            }
        },
        methods: {
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
    
    // Add a global console log to help debug
    console.log("Vue app initialized for perito association");
    
    // FALLBACK - if Vue fails, manually hide buttons for resolved reports
    setTimeout(() => {
        const buttonContainer = document.querySelector('.details-actions');
        if (buttonContainer && document.body.textContent.includes("Resolvido")) {
            const buttons = buttonContainer.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent === "Rejeitar" || button.textContent === "Aprovar") {
                    console.log("Manually hiding button:", button.textContent);
                    button.style.display = "none";
                }
            });
            
            // Show message instead
            const messageEl = document.createElement('span');
            messageEl.className = 'status-message';
            messageEl.textContent = 'Este report já foi processado';
            buttonContainer.appendChild(messageEl);
        }
    }, 500);
});

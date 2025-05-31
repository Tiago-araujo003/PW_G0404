// Perito Selector Component
Vue.component('perito-selector', {
    props: ['peritos'],
    template: `
        <div class="perito-selector">
            <div class="perito-selector-header">
                <h3>Selecionar Perito</h3>
                <button class="close-button" @click="$emit('cancel')">&times;</button>
            </div>
            <div class="peritos-list">
                <div v-for="perito in peritos" :key="perito.id" 
                     class="perito-item"
                     :class="{'unavailable': !perito.available}"
                     @click="selectPerito(perito)">
                    <img :src="perito.avatar" class="perito-avatar" :alt="perito.name">
                    <div class="perito-item-details">
                        <div class="perito-name">{{ perito.name }}</div>
                        <div class="perito-speciality">{{ perito.speciality }}</div>
                        <div class="perito-status" :class="{'available': perito.available}">
                            {{ perito.available ? 'Disponível' : 'Indisponível' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        selectPerito(perito) {
            if (perito.available) {
                this.$emit('select-perito', perito);
            }
        }
    }
});

// Main Vue App
document.addEventListener('DOMContentLoaded', function() {
    // Sample data for peritos
    const mockPeritos = [
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

    // Create Vue instance
    new Vue({
        el: '#perito-association-app',
        data: {
            showSelector: false,
            availablePeritos: mockPeritos,
            assignedPerito: null,
            reportStatus: '',
            canModifyReport: false
        },
        created() {
            // Get report status from the page
            this.getReportStatus();
            
            // Set up assigned perito for resolved reports
            if (this.reportStatus === 'resolved' || this.reportStatus === 'validated') {
                // For demo purposes, we'll use the first perito as the assigned one
                this.assignedPerito = this.availablePeritos[0];
                this.canModifyReport = false;
            } else {
                this.canModifyReport = true;
            }
        },
        methods: {
            getReportStatus() {
                // Try to get status from data attributes
                const statusElem = document.getElementById('report-status');
                if (statusElem && statusElem.dataset.status) {
                    this.reportStatus = statusElem.dataset.status;
                }
                
                // Check URL parameters for testing specific reports
                const urlParams = new URLSearchParams(window.location.search);
                const reportId = urlParams.get('id');
                
                // Force specific reports to be pending for testing
                if (['876811', '897654', '876368', '876789', '876790', '876810'].includes(reportId)) {
                    this.reportStatus = 'pending';
                }

                console.log('Report status:', this.reportStatus);
            },
            prepareAction(actionType) {
                this.actionType = actionType;
                this.showSelector = true;
            },
            assignPerito(perito) {
                this.assignedPerito = perito;
                this.showSelector = false;
                
                // Update UI for demo purposes
                alert(`Report ${this.actionType === 'approve' ? 'aprovado' : 'rejeitado'} e atribuído ao perito ${perito.name}`);
                
                // Update the status
                const viewReportButton = document.getElementById('view-report-button');
                if (viewReportButton) {
                    viewReportButton.style.display = 'block';
                }
                
                // Show the perito section that was previously hidden
                const peritoSection = document.getElementById('perito-allocation-section');
                if (peritoSection) {
                    peritoSection.style.display = 'block';
                    
                    // Update perito info in the section
                    const peritoName = peritoSection.querySelector('.perito-name');
                    const peritoSpeciality = peritoSection.querySelector('.perito-speciality');
                    const peritoContact = peritoSection.querySelector('.perito-contact');
                    const peritoAvatar = peritoSection.querySelector('.perito-avatar');
                    
                    if (peritoName) peritoName.textContent = perito.name;
                    if (peritoSpeciality) peritoSpeciality.textContent = perito.speciality;
                    if (peritoContact) peritoContact.textContent = `${perito.email} | ${perito.phone}`;
                    if (peritoAvatar) peritoAvatar.src = perito.avatar;
                }
                
                // Hide the action buttons
                this.canModifyReport = false;
            },
            cancelSelection() {
                this.showSelector = false;
            }
        },
        components: {
            'perito-selector': {
                props: ['peritos'],
                template: `
                    <div class="perito-selector">
                        <div class="perito-selector-header">
                            <h3>Selecionar Perito</h3>
                            <button class="close-button" @click="$emit('cancel')">&times;</button>
                        </div>
                        <div class="peritos-list">
                            <div v-for="perito in peritos" :key="perito.id" 
                                 class="perito-item"
                                 :class="{'unavailable': !perito.available}"
                                 @click="selectPerito(perito)">
                                <img :src="perito.avatar" class="perito-avatar" :alt="perito.name">
                                <div class="perito-item-details">
                                    <div class="perito-name">{{ perito.name }}</div>
                                    <div class="perito-speciality">{{ perito.speciality }}</div>
                                    <div class="perito-status" :class="{'available': perito.available}">
                                        {{ perito.available ? 'Disponível' : 'Indisponível' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                methods: {
                    selectPerito(perito) {
                        if (perito.available) {
                            this.$emit('select-perito', perito);
                        }
                    }
                }
            }
        }
    });

    // Expose functions for non-Vue scripts
    window.showPeritoSelector = function(actionType) {
        const app = document.getElementById('perito-association-app').__vue__;
        app.prepareAction(actionType);
    };
});

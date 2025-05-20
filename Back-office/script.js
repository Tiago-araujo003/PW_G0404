// Function to fetch accounts from the accounts.txt file
async function fetchAccounts() {
    try {
        const response = await fetch('accounts.txt');
        if (!response.ok) {
            throw new Error('Failed to fetch accounts.');
        }
        const data = await response.text();
        const accounts = data.split('\n').filter(line => line.trim()).map(line => {
            const [username, password] = line.split(',');
            return { username: username.trim(), password: password.trim() };
        });
        return accounts;
    } catch (error) {
        console.error(error);
        alert('An error occurred while fetching accounts.');
        return [];
    }
}

// Handle form submission for the login page
async function handleLogin(event) {
    event.preventDefault(); // Prevent page reload
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        const accounts = await fetchAccounts();
        const account = accounts.find(acc => acc.username === username && acc.password === password);

        if (account) {
            alert(`Logged in as ${username}`);
            window.location.href = "Dashboard.html"; // Redirect to the dashboard
        } else {
            alert('Invalid username or password.');
        }
    } else {
        alert('Please fill in both fields.');
    }
}

// Handle form submission for the new account page
async function handleCreateAccount(event) {
    event.preventDefault(); // Prevent page reload
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value; // Email is not used in this example
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (username && email && password && confirmPassword) {
        if (password === confirmPassword) {
            try {
                const response = await fetch('http://localhost:3000/create-account', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    alert(`Account created for ${username}`);
                } else {
                    const errorMessage = await response.text();
                    alert(`Failed to create account: ${errorMessage}`);
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred while creating the account.');
            }
        } else {
            alert('Passwords do not match.');
        }
    } else {
        alert('Please fill in all fields.');
    }
}

// Handle form submission for the reset password page
function handleResetPassword(event) {
    event.preventDefault(); // Prevent page reload
    const email = document.getElementById('email').value;

    if (email) {
        alert(`Password reset link sent to ${email}`);
    } else {
        alert('Please enter your email.');
    }
}

// Handle Google login
window.handleGoogleLogin = async function(response) {
    const token = response.credential; // Extract the Google token

    try {
        const res = await fetch('http://localhost:3000/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });

        if (res.ok) {
            const data = await res.json();
            alert(`Logged in as ${data.name}`);
            window.location.href = "Dashboard.html"; // Redirect to the dashboard
        } else {
            const errorMessage = await res.text();
            alert(`Google login failed: ${errorMessage}`);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred during Google login.');
    }
};

// Handle "Ver detalhes" action
function viewDetails(reportId) {
    alert(`Detalhes do relatório ${reportId}`);
    // Add logic to fetch and display report details if needed
}

// Report data (mocked for demonstration purposes)
let reports = {
    "876364": {
        type: "Estacionamento Irregular",
        description: "Um veículo com a matrícula 44-PW-25 está a ocupar a via, impedindo a passagem.",
        location: "Braga, São Vitor, Avenida João Paulo II",
        date: "10/03/2025",
        image: "https://placehold.co/431x323",
        status: "resolved"
    },
    "876368": {
        type: "Congestionamento",
        description: "Trânsito intenso devido a obras na via principal.",
        location: "Porto, Rua de Santa Catarina",
        date: "14/03/2025",
        image: "https://placehold.co/431x323",
        status: "pending"
    },
    "876412": {
        type: "Lugar reservado",
        description: "Veículo estacionado em local reservado para deficientes.",
        location: "Lisboa, Praça do Comércio",
        date: "18/02/2025",
        image: "https://placehold.co/431x323",
        status: "resolved"
    },
    "876621": {
        type: "Transportes",
        description: "Autocarro atrasado devido a problemas mecânicos.",
        location: "Faro, Terminal Rodoviário",
        date: "05/03/2025",
        image: "https://placehold.co/431x323",
        status: "analysis"
    },
    "876789": {
        type: "Semáforo avariado",
        description: "O semáforo na intersecção principal está com falhas, criando risco de acidentes.",
        location: "Coimbra, Praça da República",
        date: "22/03/2025",
        image: "https://placehold.co/431x323",
        status: "pending"
    },
    "876790": {
        type: "Estrada danificada",
        description: "Buracos na estrada causando risco de acidentes.",
        location: "Aveiro, Rua da Liberdade",
        date: "25/03/2025",
        image: "https://placehold.co/431x323",
        status: "pending"
    },
    "876795": {
        type: "Sinalização inadequada",
        description: "Sinalização de trânsito confusa, causando confusão entre os motoristas.",
        location: "Viseu, Avenida da Liberdade",
        date: "28/03/2025",
        image: "https://placehold.co/431x323",
        status: "analysis"
    },
    "876810": {
        type: "Passadeira danificada",
        description: "A passadeira para pedestres está com marcas apagadas, dificilmente visível, aumentando o risco de atropelamentos. Precisa de repintura urgente.",
        location: "Guimarães, Rua D. João I, próximo ao Centro Cultural",
        date: "02/04/2025",
        image: "https://placehold.co/431x323?text=Passadeira+Danificada",
        status: "pending",
        criticality: 4
    },
    "876811": {
        type: "Veículo abandonado",
        description: "Um veículo sem matrícula está abandonado há mais de 30 dias.",
        location: "Braga, Rua do Comércio",
        date: "03/04/2025",
        image: "https://placehold.co/431x323?text=Veículo+Abandonado",
        status: "pending",
        criticality: 3
    }
};

// Load saved reports data from localStorage if available
function loadReportsData() {
    const savedReports = localStorage.getItem('reports');
    if (savedReports) {
        try {
            const parsedReports = JSON.parse(savedReports);
            
            // Ensure all our initial reports exist in the loaded data
            // This prevents report not found errors if localStorage has old data
            Object.keys(reports).forEach(reportId => {
                if (!parsedReports[reportId]) {
                    parsedReports[reportId] = reports[reportId];
                }
            });
            
            localStorage.setItem('reports', JSON.stringify(parsedReports));
            reports = parsedReports;
        } catch (error) {
            console.error("Error parsing reports from localStorage:", error);
            saveReportsData(); // Reset with default reports
        }
    } else {
        // If no saved data, save the current reports data
        saveReportsData();
    }
    
    console.log("Loaded reports data:", reports);
}

// Save reports data to localStorage
function saveReportsData() {
    localStorage.setItem('reports', JSON.stringify(reports));
}

// Initialize reports data when the script loads
loadReportsData();

// Function to fetch query parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Populate report details dynamically
function populateReportDetails() {
    const reportId = getQueryParam("id");
    console.log("Report ID from URL:", reportId);
    console.log("Available reports:", Object.keys(reports));
    
    const report = reports[reportId];

    if (report) {
        document.getElementById("report-id").textContent = `#${reportId}`;
        document.getElementById("report-type").textContent = report.type;
        document.getElementById("report-description").textContent = report.description;
        document.getElementById("report-location").textContent = report.location;
        document.getElementById("report-date").textContent = report.date;
        document.getElementById("report-image").src = report.image;

        // Show action buttons only for "pending" or "analysis" statuses
        const actionButtons = document.getElementById("action-buttons");
        if (report.status === "pending" || report.status === "analysis") {
            actionButtons.style.display = "flex";
            // Hide view report button for pending/analysis reports
            document.getElementById("view-report-button").style.display = "none";
            
            // Display criticality section for pending/analysis reports
            const criticalitySection = document.getElementById("criticality-section");
            if (criticalitySection) {
                criticalitySection.style.display = "block";
                
                // Update the current criticality display
                const currentCriticalityElement = document.getElementById("current-criticality");
                if (currentCriticalityElement) {
                    const criticality = report.criticality || 3; // Default to 3 if not set
                    const criticalityText = getCriticalityText(criticality);
                    
                    currentCriticalityElement.innerHTML = `
                        <span class="criticality-badge level-${criticality}">${criticality}</span>
                        <span style="margin-left: 8px;">${criticalityText}</span>
                    `;
                    
                    // Set the current value in the dropdown
                    const criticalitySelect = document.getElementById("criticality-select");
                    if (criticalitySelect) {
                        criticalitySelect.value = criticality;
                    }
                }
            }
        } else {
            actionButtons.style.display = "none";
            // Show view report button for resolved reports
            document.getElementById("view-report-button").style.display = "block";
            // Set the correct link with report ID
            document.getElementById("view-report-link").href = `ReportPDF.html?id=${reportId}`;
            
            // Hide criticality section for resolved reports
            const criticalitySection = document.getElementById("criticality-section");
            if (criticalitySection) {
                criticalitySection.style.display = "none";
            }
        }
    } else {
        alert("Report not found! ID: " + reportId);
        console.error("Report not found with ID:", reportId);
        // Redirect back to reports page after showing error
        setTimeout(() => {
            window.location.href = "Reports.html";
        }, 1500);
    }
}

// Get text description for criticality level
function getCriticalityText(level) {
    switch (parseInt(level)) {
        case 1: return "Baixo";
        case 2: return "Moderado";
        case 3: return "Médio";
        case 4: return "Alto";
        case 5: return "Muito Alto";
        default: return "Médio";
    }
}

// Enhanced function to update report criticality
function updateReportCriticality() {
    const reportId = getQueryParam("id");
    const criticalitySelect = document.getElementById("criticality-select");
    
    if (reportId && criticalitySelect) {
        const criticality = parseInt(criticalitySelect.value);
        
        if (reports[reportId]) {
            // Update report criticality
            reports[reportId].criticality = criticality;
            
            // Save data
            saveReportsData();
            
            // Update display
            const currentCriticalityElement = document.getElementById("current-criticality");
            if (currentCriticalityElement) {
                const criticalityText = getCriticalityText(criticality);
                
                currentCriticalityElement.innerHTML = `
                    <span class="criticality-badge level-${criticality}">${criticality}</span>
                    <span style="margin-left: 8px;">${criticalityText}</span>
                `;
            }
            
            // Set timestamp for cross-tab communication
            localStorage.setItem('criticalityUpdate', JSON.stringify({
                reportId: reportId,
                criticality: criticality,
                timestamp: new Date().getTime()
            }));
            
            alert("Nível de criticidade atualizado com sucesso!");
        }
    }
}

// Listen for changes in localStorage (for cross-tab communication)
window.addEventListener('storage', function(e) {
    if (e.key === 'criticalityUpdate') {
        try {
            const update = JSON.parse(e.newValue);
            
            // Check if we're on the Reports page
            if (window.location.pathname.endsWith('Reports.html') || window.location.pathname.includes('Reports')) {
                updateCriticalityBadge(update.reportId, update.criticality);
            }
        } catch (error) {
            console.error("Error handling criticality update:", error);
        }
    }
});

// Function to update criticality badge in the Reports page
function updateCriticalityBadge(reportId, criticality) {
    const reportRows = document.querySelectorAll(".reports-table tbody tr");
    
    reportRows.forEach(row => {
        const idCell = row.querySelector("td:first-child");
        if (idCell && idCell.textContent.replace('#', '') === reportId) {
            const criticalityCell = row.querySelector("td:nth-child(5)");
            
            if (criticalityCell) {
                const badge = criticalityCell.querySelector(".criticality-badge");
                
                if (badge) {
                    // Remove all level classes
                    badge.classList.remove("level-1", "level-2", "level-3", "level-4", "level-5");
                    // Add new level class
                    badge.classList.add(`level-${criticality}`);
                    // Update text
                    badge.textContent = criticality;
                    
                    console.log(`Updated criticality badge for report ${reportId} to level ${criticality}`);
                }
            }
        }
    });
}

// More robust function to update report status in the Reports page
function updateReportStatus() {
    console.log("Updating report status...");
    console.log("Current reports data:", reports);
    
    const reportRows = document.querySelectorAll(".reports-table tbody tr");
    
    reportRows.forEach(row => {
        const idCell = row.querySelector("td:first-child");
        if (idCell) {
            const reportId = idCell.textContent.replace('#', '');
            console.log("Processing row for report ID:", reportId);
            
            if (reports[reportId]) {
                const statusCell = row.querySelector("td:nth-child(4)");
                const dropdownMenu = row.querySelector('.dropdown-menu');
                
                console.log(`Report ${reportId} status:`, reports[reportId].status);
                
                if (statusCell) {
                    // First, remove all status classes
                    statusCell.classList.remove('status-resolved', 'status-pending', 'status-analysis');
                    
                    // Apply appropriate class and text based on status
                    if (reports[reportId].status === 'resolved') {
                        statusCell.classList.add('status-resolved');
                        statusCell.textContent = 'Resolvido';
                        
                        // Update dropdown menu for resolved reports
                        if (dropdownMenu) {
                            // Check if "Ver relatório" link already exists
                            const hasViewReportLink = Array.from(dropdownMenu.querySelectorAll('a')).some(
                                link => link.textContent === 'Ver relatório'
                            );
                            
                            if (!hasViewReportLink) {
                                console.log(`Adding "Ver relatório" link for report ${reportId}`);
                                const viewReportLink = document.createElement('a');
                                viewReportLink.href = `ReportPDF.html?id=${reportId}`;
                                viewReportLink.textContent = 'Ver relatório';
                                dropdownMenu.appendChild(viewReportLink);
                            }
                        }
                    } else if (reports[reportId].status === 'pending') {
                        statusCell.classList.add('status-pending');
                        statusCell.textContent = 'Pendente';
                    } else if (reports[reportId].status === 'analysis') {
                        statusCell.classList.add('status-analysis');
                        statusCell.textContent = 'Em análise';
                    }
                }
            }
        }
    });

    // Also update criticality badges - add this after status updates
    reportRows.forEach(row => {
        const idCell = row.querySelector("td:first-child");
        if (idCell) {
            const reportId = idCell.textContent.replace('#', '');
            
            if (reports[reportId]) {
                const criticalityCell = row.querySelector("td:nth-child(5)");
                const criticalityBadge = criticalityCell ? criticalityCell.querySelector(".criticality-badge") : null;
                
                if (criticalityBadge && reports[reportId].criticality) {
                    // Remove all level classes
                    criticalityBadge.classList.remove("level-1", "level-2", "level-3", "level-4", "level-5");
                    // Add new level class
                    criticalityBadge.classList.add(`level-${reports[reportId].criticality}`);
                    // Update text
                    criticalityBadge.textContent = reports[reportId].criticality;
                }
            }
        }
    });
}

// Função para aprovar o relatório
function approveReport(reportId) {
    const report = reports[reportId];
    
    if (report) {
        // Atualiza o status do relatório para 'resolved'
        report.status = 'resolved';
        
        // Salvar as alterações em localStorage
        saveReportsData();
        
        // Redireciona para a página de sucesso
        window.location.href = 'ApprovalSuccess.html?id=' + reportId;
    } else {
        alert('Relatório não encontrado!');
    }
}

// Função para rejeitar o relatório
function rejectReport(reportId) {
    const report = reports[reportId];
    
    if (report) {
        // Atualiza o status do relatório para 'resolved' mesmo quando rejeitado
        report.status = 'resolved';
        
        // Salvar as alterações em localStorage
        saveReportsData();
        
        // Exibe mensagem de sucesso
        alert('Relatório rejeitado com sucesso!');
        
        // Retorna para a página de relatórios
        window.location.href = 'Reports.html';
    } else {
        alert('Relatório não encontrado!');
    }
}

// Adiciona event listeners aos botões de aprovação e rejeição
function setupActionButtons() {
    const reportId = getQueryParam("id");
    
    const approveButton = document.querySelector('.approve-button');
    if (approveButton) {
        approveButton.addEventListener('click', function() {
            approveReport(reportId);
        });
    }
    
    const rejectButton = document.querySelector('.reject-button');
    if (rejectButton) {
        rejectButton.addEventListener('click', function() {
            rejectReport(reportId);
        });
    }
}

// Fix for Reports.html page to ensure it loads with the latest status
document.addEventListener("DOMContentLoaded", function() {
    // Initialize reports data when page loads
    loadReportsData();
    
    const currentPath = window.location.pathname;
    
    console.log("Current path:", currentPath);
    
    // Check if we're on the Reports page
    if (currentPath.endsWith("Reports.html") || currentPath.includes("Reports")) {
        console.log("On Reports page, updating statuses");
        updateReportStatus();
    }
    
    // Check if we're on the ReportDetails page
    if (currentPath.endsWith("ReportDetails.html") || currentPath.includes("ReportDetails")) {
        console.log("On ReportDetails page, populating details");
        populateReportDetails();
        setupActionButtons();
    }
});

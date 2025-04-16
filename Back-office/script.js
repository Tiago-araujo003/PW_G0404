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
    }
};

// Load saved reports data from localStorage if available
function loadReportsData() {
    const savedReports = localStorage.getItem('reports');
    if (savedReports) {
        const parsedReports = JSON.parse(savedReports);
        
        // Ensure the new report exists in the loaded data
        if (!parsedReports['876789']) {
            parsedReports['876789'] = {
                type: "Semáforo avariado",
                description: "O semáforo na intersecção principal está com falhas, criando risco de acidentes.",
                location: "Coimbra, Praça da República",
                date: "22/03/2025",
                image: "https://placehold.co/431x323",
                status: "pending"
            };
            localStorage.setItem('reports', JSON.stringify(parsedReports));
        }
        
        reports = parsedReports;
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
        } else {
            actionButtons.style.display = "none";
            // Show view report button for resolved reports
            document.getElementById("view-report-button").style.display = "block";
            // Set the correct link with report ID
            document.getElementById("view-report-link").href = `ReportPDF.html?id=${reportId}`;
        }
    } else {
        alert("Report not found!");
    }
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

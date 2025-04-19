// Função para abrir o menu lateral
function openMenu() {
    document.getElementById("sideMenu").classList.add("open");
  }
  
  // Função para fechar o menu lateral
  function closeMenu() {
    document.getElementById("sideMenu").classList.remove("open");
  }
  
  // Função para redirecionar ao clicar no cartão
function navigateToPage(page) {
  window.location.href = page;  // Redireciona para a página especificada
}

// Adicionar ouvintes de evento para cada cartão
document.getElementById('report-card').addEventListener('click', function() {
  navigateToPage('report.html'); // Redireciona para a página de Report
});


document.getElementById('auditorias-card').addEventListener('click', function() {
  navigateToPage('auditorias.html'); // Redireciona para a página de Auditorias
});

document.getElementById('registos-card').addEventListener('click', function() {
  navigateToPage('registos.html'); // Redireciona para a página de Registros
});

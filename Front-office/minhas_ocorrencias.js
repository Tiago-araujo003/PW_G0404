// Função para abrir o menu lateral (placeholder)
function openMenu() {
    alert("Menu aberto!");
  }
  
  // Simular status aleatório
  function gerarStatus() {
    const status = ["Resolvido", "Pendente", "Em Análise"];
    return status[Math.floor(Math.random() * status.length)];
  }
  
  // Carregar submissões
  const submissions = JSON.parse(localStorage.getItem('submissoes')) || [];
  const tabela = document.getElementById('tabelaOcorrencias');
  
  submissions.forEach((submissao, index) => {
    const tr = document.createElement('tr');
  
    const statusAtual = gerarStatus();
    let statusClass = "";
    if (statusAtual === "Resolvido") statusClass = "resolvido";
    if (statusAtual === "Pendente") statusClass = "pendente";
    if (statusAtual === "Em Análise") statusClass = "analise";
  
    tr.innerHTML = `
      <td data-label="ID">#${index + 1}</td>
      <td data-label="Tipo">${submissao.tipo}</td>
      <td data-label="Localização">${submissao.localizacao}</td>
      <td data-label="Status"><span class="status ${statusClass}">${statusAtual}</span></td>
      <td data-label="Data">${submissao.dataHora}</td>
      <td data-label="Ação"><a href="#" class="ver-mais">Ver mais</a></td>
    `;
  
    tabela.appendChild(tr);
  });
  
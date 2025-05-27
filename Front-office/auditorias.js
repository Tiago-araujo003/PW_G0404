document.addEventListener('DOMContentLoaded', function () {
  const ocorrencias = JSON.parse(localStorage.getItem('submissoes')) || [];

  // Atualizar total de ocorrências
  const totalElemento = document.querySelector('.total-oc h1');
  if (totalElemento) {
    totalElemento.textContent = ocorrencias.length;
  }

  // Atualizar listagem
  const tabela = document.querySelector('.tabela-ocorrencias');
  if (tabela) {
    // Limpar linhas antigas (exceto o cabeçalho)
    const linhasExistentes = tabela.querySelectorAll('.linha');
    linhasExistentes.forEach(linha => linha.remove());

    // Adicionar novas linhas com os dados do localStorage
    ocorrencias.forEach((ocorrencia) => {
      const linha = document.createElement('div');
      linha.classList.add('linha');

      linha.innerHTML = `
        <span>${ocorrencia.dataHora}</span>
        <span>${ocorrencia.morada}, ${ocorrencia.localizacao}</span>
        <span>${ocorrencia.descricao}</span>
      `;

      tabela.appendChild(linha);
    });
  }
});

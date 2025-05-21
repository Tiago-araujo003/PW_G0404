// Função para abrir o menu lateral
function openMenu() {
  document.getElementById("sideMenu").classList.add("open");
}

// Função para fechar o menu lateral
function closeMenu() {
  document.getElementById("sideMenu").classList.remove("open");
}

// Mostrar notificação de sucesso
function showNotification() {
  document.getElementById('successNotification').classList.remove('hidden');
  setTimeout(closeNotification, 5000);
}

// Fechar a notificação
function closeNotification() {
  document.getElementById('successNotification').classList.add('hidden');
}

// Função para guardar no LocalStorage
function guardarSubmissao(submissao) {
  let submissoes = JSON.parse(localStorage.getItem('submissoes')) || [];
  submissoes.push(submissao);
  localStorage.setItem('submissoes', JSON.stringify(submissoes));
}

// Submissão do formulário
document.getElementById('reportForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o comportamento normal

  const tipo = document.getElementById('tipo').value;
  const descricao = document.getElementById('descricao').value;
  const morada = document.getElementById('morada').value;
  const localizacao = document.getElementById('Distrito').value;
  const termosAceitos = document.getElementById('termos').checked;
  const ficheiro = document.getElementById('ficheiro').files[0];

  if (!termosAceitos) {
    alert('Por favor aceite os termos antes de submeter.');
    return;
  }

  if (ficheiro) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imagemBase64 = e.target.result;

      const novaSubmissao = {
        tipo: tipo,
        descricao: descricao,
        morada: morada,
        localizacao: localizacao,
        ficheiro: imagemBase64, // Guarda a imagem em base64
        dataHora: new Date().toLocaleString()
      };

      guardarSubmissao(novaSubmissao);
      showNotification();
      document.getElementById('reportForm').reset();
    };
    reader.readAsDataURL(ficheiro);
  } else {
    const novaSubmissao = {
      tipo: tipo,
      descricao: descricao,
      morada: morada,
      localizacao: localizacao,
      ficheiro: "Nenhum ficheiro",
      dataHora: new Date().toLocaleString()
    };

    guardarSubmissao(novaSubmissao);
    showNotification();
    this.reset();
  }
});

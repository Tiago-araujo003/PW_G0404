// Abrir menu lateral
function openMenu() {
  document.getElementById("sideMenu").classList.add("open");
}

// Fechar menu lateral
function closeMenu() {
  document.getElementById("sideMenu").classList.remove("open");
}

// Mostrar notificação de sucesso
function showNotification() {
  document.getElementById('successNotification').classList.remove('hidden');
  setTimeout(closeNotification, 5000);
}

// Fechar notificação
function closeNotification() {
  document.getElementById('successNotification').classList.add('hidden');
}

// ✅ Gerar número sequencial para ID do pedido
function obterProximoId() {
  const submissoes = JSON.parse(localStorage.getItem('submissoes')) || [];
  return submissoes.length;
}

// Guardar submissão no localStorage
function guardarSubmissao(submissao) {
  let submissoes = JSON.parse(localStorage.getItem('submissoes')) || [];
  submissoes.push(submissao);
  localStorage.setItem('submissoes', JSON.stringify(submissoes));
}

// Submissão do formulário
document.getElementById('reportForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o envio do formulário

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

if (!ficheiro) {
  showImageNotification();
  return;
}



  // Quando há ficheiro
  if (ficheiro) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imagemBase64 = e.target.result;

      localStorage.setItem("utilizadorLogado", "a104076@alunos.uminho.pt"); /*INSERIR LOG IN COM GOOGLE*/

      const utilizador = localStorage.getItem("utilizadorLogado");

      const novaSubmissao = {
        idPedido: obterProximoId(), 
        tipo: tipo,
        descricao: descricao,
        morada: morada,
        localizacao: localizacao,
        ficheiro: imagemBase64,
        dataHora: new Date().toLocaleString(),
        email: utilizador
      };

      guardarSubmissao(novaSubmissao);
      showNotification();
      document.getElementById('reportForm').reset();
    };
    reader.readAsDataURL(ficheiro);
  } else {
    // Sem ficheiro
    const novaSubmissao = {
      idPedido: obterProximoId(),
      tipo: tipo,
      descricao: descricao,
      morada: morada,
      localizacao: localizacao,
      ficheiro: "Nenhum ficheiro",
      dataHora: new Date().toLocaleString(),
      email: utilizador
    };

    guardarSubmissao(novaSubmissao);
    showNotification();
    document.getElementById('reportForm').reset();
  }
});


function showImageNotification() {
  document.getElementById('imageErrorNotification').classList.remove('hidden');
  setTimeout(closeImageNotification, 5000);
}

function closeImageNotification() {
  document.getElementById('imageErrorNotification').classList.add('hidden');
}
// Verifica se o ficheiro é uma imagem
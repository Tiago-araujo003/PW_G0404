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

document.addEventListener("DOMContentLoaded", function () {
  // Adicionar ouvintes de evento para cada cartão
  document.getElementById('report-card')?.addEventListener('click', function() {
    navigateToPage('report.html');
  });
  document.getElementById('auditorias-card')?.addEventListener('click', function() {
    navigateToPage('auditorias.html');
  });
  document.getElementById('registos-card')?.addEventListener('click', function() {
    navigateToPage('registos.html');
  });
  });

  // Animação da imagem inicial
  const image = document.querySelector('.animated-image');
  if (image) image.classList.add('animate');

  // Feedback

  document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('feedbackForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const idade = form.querySelector('input[type="number"]').value.trim();
    const sugestoes = form.querySelector('textarea').value.trim();
    const avaliacao = form.querySelector('input[name="avaliacao"]:checked');

    const nomeValido = /^[A-Za-zÀ-ÿ\s]+$/.test(nome);

    if (!nome || !email || !idade || !avaliacao) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

     if (idade <= 17) {
      alert("A idade deve ser superior.");
      return;
    }

     if (!nomeValido) {
      alert("O nome não pode conter números ou caracteres inválidos.");
      return;
    }

    const feedback = {
      nome,
      email,
      idade,
      avaliacao: avaliacao.id,
      sugestoes
    };

    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    feedbacks.push(feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

    form.reset();
    alert("Obrigado pelo seu feedback!");
  });
});

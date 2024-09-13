document.getElementById('consultForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cnpjInput = document.getElementById('cnpj').value;
    const cleanedCNPJ = cnpjInput.replace(/\D/g, ''); // Remove tudo que não for número

    if (cleanedCNPJ.length === 14 || cleanedCNPJ.length === 18) {
        // Redireciona para a página de resultado passando o CNPJ via URL
        window.location.href = `resultado.html?cnpj=${cleanedCNPJ}`;
    } else {
        document.getElementById('errorMessage').textContent = 'CNPJ inválido. Verifique e tente novamente.';
    }
});

function redirectToPage(cnpj, targetPage) {
    const cleanedCNPJ = cnpj.replace(/\D/g, ''); // Remove tudo que não for número

    if (cleanedCNPJ.length === 14 || cleanedCNPJ.length === 18) {
        // Redireciona para a página de resultado passando o CNPJ via URL
        window.location.href = `${targetPage}?cnpj=${cleanedCNPJ}`;
    } else {
        document.getElementById('errorMessage').textContent = 'CNPJ inválido. Verifique e tente novamente.';
    }
}

// Event listener para o botão "Consultar Módulos"
document.getElementById('consultarModulosBtn').addEventListener('click', function() {
    const cnpj = document.getElementById('cnpj').value;
    redirectToPage(cnpj, 'resultado.html');
});

// Event listener para o botão "Consultar Backup"
// document.getElementById('consultarBackupBtn').addEventListener('click', function() {
//    const cnpj = document.getElementById('cnpj').value;
//   redirectToPage(cnpj, 'resultado_BKP.html');
//});

// Event listener para o formulário (mantém a compatibilidade com o submit do formulário)
document.getElementById('consultForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const cnpj = document.getElementById('cnpj').value;
    redirectToPage(cnpj, 'resultado.html'); // Pode alterar para um dos botões se necessário
});

// Seleciona o botão, a imagem e o texto
const toggleButton = document.getElementById('toggleButton');
const toggleText = document.getElementById('toggleText');
const toggleImage = document.getElementById('toggleImage');

// Adiciona o evento de clique para alternar o estado 'ativo'
toggleButton.addEventListener('click', function() {
    this.classList.toggle('active'); // Alterna a classe 'active'

    // Verifica se o botão está "ligado"
    if (this.classList.contains('active')) {
        // Altera a imagem para 'gerencieaqui.png' quando ligado
        toggleImage.src = 'assets/GA.png'; // Caminho da nova imagem
        toggleText.textContent = 'Gerencie Aqui'; // Texto quando o sistema é trocado
    } else {
        // Retorna a imagem original 'SIEM Colorido.png' quando desligado
        toggleImage.src = 'assets/SIEM.png'; // Caminho da imagem original
        toggleText.textContent = 'SIEM'; // Texto quando retorna para o sistema SIEM
    }
});
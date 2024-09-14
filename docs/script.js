// Event listener para o formulário
document.getElementById('consultForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cnpjInput = document.getElementById('cnpj').value;
    const cleanedCNPJ = cnpjInput.replace(/\D/g, ''); // Remove tudo que não for número

    if (cleanedCNPJ.length === 14 || cleanedCNPJ.length === 18) {
        // Salva o CNPJ no LocalStorage (ou SessionStorage)
        localStorage.setItem('cnpjDigitado', cleanedCNPJ);

        // Redireciona para a página de resultados
        window.location.href = `resultado.html?cnpj=${cleanedCNPJ}`;
    } else {
        document.getElementById('errorMessage').textContent = 'CNPJ inválido. Verifique e tente novamente.';
    }
});

// Seleciona o botão, a imagem e o texto
const toggleButton = document.getElementById('toggleButton');
const toggleText = document.getElementById('toggleText');
const toggleImage = document.getElementById('toggleImage');

// Função para atualizar a UI com base no estado do botão
function updateButtonState(isActive) {
    if (isActive) {
        // Altera a imagem para 'gerencieaqui.png' e o texto quando ligado
        toggleImage.src = 'assets/GA.png'; // Caminho da nova imagem
        toggleText.textContent = 'Alternar sistema';
    } else {
        // Retorna a imagem original 'SIEM Colorido.png' e o texto quando desligado
        toggleImage.src = 'assets/SIEM.png'; // Caminho da imagem original
        toggleText.textContent = 'Alternar sistema';
    }
}

// Função para exibir a mensagem de erro
function showError(message) {
    var errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message; // Define a mensagem de erro
    errorElement.classList.add('visible'); // Adiciona a classe para mostrar a mensagem
}

// Função para ocultar a mensagem de erro
function hideError() {
    var errorElement = document.getElementById('errorMessage');
    errorElement.classList.remove('visible'); // Remove a classe para esconder a mensagem
}

// Carrega o estado do botão do localStorage quando a página é carregada
window.addEventListener('DOMContentLoaded', () => {
    const savedState = localStorage.getItem('toggleState');
    const isActive = savedState === 'active'; // Estado ativo se o valor for 'active'
    updateButtonState(isActive);
    if (isActive) {
        toggleButton.classList.add('active'); // Aplica a classe 'active'
    }
});

// Adiciona o evento de clique para alternar o estado 'ativo'
toggleButton.addEventListener('click', function() {
    const isActive = this.classList.toggle('active'); // Alterna a classe 'active'
    
    // Atualiza a UI com base no estado atual
    updateButtonState(isActive);

    // Salva o estado atual no localStorage
    localStorage.setItem('toggleState', isActive ? 'active' : 'inactive');
});

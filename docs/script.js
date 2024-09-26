// Event listener para o formulário
document.getElementById('consultForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const inputValue = document.getElementById('cnpj').value;
    const cleanedInput = inputValue.replace(/\D/g, ''); // Remove tudo que não for número

    // Verifica se é um CNPJ ou CPF
    if (cleanedInput.length === 14 || cleanedInput.length === 11) {
        // Oculta a mensagem de erro se o CNPJ/CPF for válido
        hideError();

        // Salva o CNPJ/CPF no LocalStorage (ou SessionStorage)
        localStorage.setItem('cnpjDigitado', cleanedInput);

        // Redireciona para a página de resultados
        window.location.href = `resultado.html?cnpj=${cleanedInput}`;
    } else {
        // Exibe a mensagem de erro se o CNPJ/CPF for inválido
        showError('CNPJ ou CPF inválido. Verifique e tente novamente.');
    }
});

// Adiciona um evento de input ao campo de CNPJ/CPF para ocultar a mensagem de erro quando o valor é alterado
document.getElementById('cnpj').addEventListener('input', function() {
    // Verifica o valor do CNPJ/CPF e oculta a mensagem se for válido
    const inputValue = this.value;
    const cleanedInput = inputValue.replace(/\D/g, '');

    if (cleanedInput.length === 14 || cleanedInput.length === 11) {
        hideError(); // Oculta a mensagem se o valor for válido
    } else {
        // Caso o valor ainda seja inválido, não faz nada
        // A mensagem de erro será exibida novamente quando o formulário for submetido
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
        toggleImage.src = 'assets/IconeSistema/GA.png'; // Caminho da nova imagem
        toggleText.textContent = 'Alternar sistema';
    } else {
        // Retorna a imagem original 'SIEM Colorido.png' e o texto quando desligado
        toggleImage.src = 'assets/IconeSistema/SIEM.png'; // Caminho da imagem original
        toggleText.textContent = 'Alternar sistema';
    }
}

// Função para redirecionar para a página e exibir mensagens de erro
function redirectToPage(cnpj, targetPage) {
    const cleanedCNPJ = cnpj.replace(/\D/g, ''); // Remove tudo que não for número

    if (cleanedCNPJ.length === 14 || cleanedCNPJ.length === 18) {
        // Oculta a mensagem de erro se o CNPJ for válido
        hideError();
        // Redireciona para a página de resultado passando o CNPJ via URL
        window.location.href = `${targetPage}?cnpj=${cleanedCNPJ}`;
    } else {
        // Exibe a mensagem de erro se o CNPJ não for válido
        showError('CNPJ inválido. Certifique-se de que o CNPJ tenha todos os dígitos');
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

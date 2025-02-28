// Event listener para o formulário
document.getElementById('consultarModulosBtn').addEventListener('click', function(event) {
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
        window.location.href = `resultado.html`;
    } else {
        // Exibe a mensagem de erro se o CNPJ/CPF for inválido
        showError('CNPJ ou CPF inválido. Verifique e tente novamente.');
    }
});

document.getElementById('consultaBKP').addEventListener('click', function(event) {
    event.preventDefault();

    const inputValue = document.getElementById('cnpj').value;
    const cleanedInput = inputValue.replace(/\D/g, ''); // Remove tudo que não for número

    // Verifica se é um CNPJ ou CPF
    if (cleanedInput.length === 14 || cleanedInput.length === 11) {
        // Oculta a mensagem de erro se o CNPJ/CPF for válido
        hideError();

        // Salva o CNPJ/CPF no LocalStorage (ou SessionStorage)
        localStorage.setItem('cnpjDigitado', cleanedInput);

        // Redireciona para a página de BAACKUP
        window.location.href = `resultado_BKP.html`;
    } else {
        // Exibe a mensagem de erro se o CNPJ/CPF for inválido
        showError('CNPJ ou CPF inválido. Verifique e tente novamente.');
    }
});


document.getElementById('cnpj').addEventListener('input', function() {
    // Verifica o valor do CNPJ/CPF e oculta a mensagem se for válido
    const inputValue = this.value;
    const cleanedInput = inputValue.replace(/\D/g, '');

    if (cleanedInput.length === 14 || cleanedInput.length === 11) {
        hideError(); // Oculta a mensagem se o valor for válido
    } else {
        // Caso o valor ainda seja inválido, não faz nada
    }
});


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
    errorElement.textContent = ""; // Limpa a mensagem de erro
    errorElement.classList.remove('visible'); // Remove a classe para esconder a mensagem
}


// Exibir erro com animação
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.classList.add('visible');

    const tokenInput = document.getElementById('token');
    tokenInput.classList.add('input-error');

    // Remover o erro após um tempo
    setTimeout(() => {
        errorElement.classList.remove('visible');
        tokenInput.classList.remove('input-error');
    }, 3000);
}   

    // Função para formatar a data (YYYY-MM-DD) para comparação
function formatDate(date) {
    return date.toISOString().split('T')[0]; // Retorna somente a data (sem a hora)
}

// Função para verificar se o token precisa ser solicitado novamente
function checkTokenExpiration() {
    const lastValidationDate = localStorage.getItem('lastTokenValidation');
    const currentDate = new Date();
    const formattedCurrentDate = formatDate(currentDate);

    // Se não houver data de validação ou a data for diferente de hoje, pede o token
    if (!lastValidationDate || lastValidationDate !== formattedCurrentDate) {
        requestToken(); // Solicita o token
    } else {
        // Caso a data de validação seja hoje, checa se se passaram mais de 8 horas
        const lastValidationTime = new Date(localStorage.getItem('lastTokenValidationTime'));
        const timeDifference = currentDate - lastValidationTime; // Em milissegundos
        const eightHoursInMilliseconds = 8 * 60 * 60 * 1000; // 8 horas em milissegundos
        //const eightHoursInMilliseconds = 5 * 1000; // 8 horas em milissegundos

        if (timeDifference >= eightHoursInMilliseconds) {

            // Mostrar mensagem de sucesso
            const tokenExpiratedMessage = document.getElementById('tokenExpiratedMessage');
            tokenExpiratedMessage.classList.add('show');
            
   
            setTimeout(() => {
                tokenExpiratedMessage.classList.remove('show');
            }, 3000);
            requestToken(); // Solicita o token
        } else {
            // Libera os campos
            enableFields();
        }
    }
}

// Função para solicitar o token
function requestToken() {
    // Exibe os campos para inserir o token
    document.getElementById('inserirToken').style.display = 'block';
    document.getElementById('token').style.display = 'block';
    document.getElementById('confirmToken').style.display = 'block';

    // Oculta os campos de consulta
    document.getElementById('consulte').style.display = 'none';
    document.getElementById('cnpj').style.display = 'none';
    document.getElementById('consultarModulosBtn').style.display = 'none';
    document.getElementById('consultaBKP').style.display = 'none';
    document.getElementById('discordServer').style.display = 'none';
}

// Função para liberar os campos
function enableFields() {
    // Exibe os campos de consulta
    document.getElementById('consulte').style.display = 'block';
    document.getElementById('cnpj').style.display = 'block';
    document.getElementById('consultarModulosBtn').style.display = 'block';
    document.getElementById('consultaBKP').style.display = 'block';
    document.getElementById('discordServer').style.display = 'block';

    // Esconde os campos de token
    document.getElementById('inserirToken').style.display = 'none';
    document.getElementById('token').style.display = 'none';
    document.getElementById('confirmToken').style.display = 'none';
}

// Evento de clique para validar o token
document.getElementById('confirmToken').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o envio do formulário
    const token = document.getElementById('token').value.trim();

    if (!token) {
        showError("Por favor, preencha o token de segurança!");
        return;
    }

    fetch(`https://servidor-proxy.vercel.app/proxy/validarToken`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }) // Envia o token para o backend
    })
    .then(response => response.json())
    .then(data => {
        if (data.valid) {
            // Armazena a data de validação
            const currentDate = new Date();
            localStorage.setItem('lastTokenValidation', formatDate(currentDate)); // Armazena data (sem hora)
            localStorage.setItem('lastTokenValidationTime', currentDate.toISOString()); // Armazena a data e hora
            localStorage.setItem('token', token); // Armazena o token validado
   
            enableFields();

            // Mostrar mensagem de sucesso
            const successMessage = document.getElementById('successMessage');
            successMessage.classList.add('show');
            
            // Ocultar a mensagem após alguns segundos
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 3000); // 3 segundos
        } else {
            showError("Token incorreto. Tente novamente.");
        }
    })
    .catch(error => {
        console.error('Erro ao validar o token:', error);
        showError("Erro na validação do token.");
    });
});

// Chama a função para verificar a expiração do token
checkTokenExpiration();

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

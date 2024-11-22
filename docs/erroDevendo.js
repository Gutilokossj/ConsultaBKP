document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Obtém o CNPJ e a data de expiração da URL
    const cnpj = urlParams.get('cnpj');
    const expirationDate = urlParams.get('expirationDate');

    // Exibe o CNPJ formatado
    if (cnpj) {
        document.getElementById('cnpjInfo').textContent = `${formatCNPJ(cnpj)}`;
    } else {
        document.getElementById('cnpjInfo').textContent = 'CNPJ não disponível';
    }

    // Exibe a data de expiração
    if (expirationDate) {
        document.getElementById('expirationDate').textContent = `Data de Expiração: ${expirationDate}`;
    } else {
        document.getElementById('expirationDate').textContent = 'Data de Expiração não disponível';
    }
});

// Função para formatar o CNPJ
function formatCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

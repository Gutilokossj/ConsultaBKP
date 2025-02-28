document.addEventListener('DOMContentLoaded', () => {
        // Recupera o CNPJ armazenado no LocalStorage
        const cnpj = localStorage.getItem('cnpjDigitado');
    
    if (cnpj) {
        document.getElementById('cnpjInfo').textContent = `${formatCNPJ(cnpj)}`;
    } else {
        document.getElementById('cnpjInfo').textContent = 'CNPJ não disponível';
    }
});

// Função para formatar o CNPJ
function formatCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}
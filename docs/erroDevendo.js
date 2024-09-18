
document.addEventListener('DOMContentLoaded', () => {
    // Função para obter o parâmetro da URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Obtém a data de expiração da URL
    const expirationDate = getQueryParam('expirationDate');

    // Exibe a data de expiração no elemento com id 'expirationDate'
    if (expirationDate) {
        document.getElementById('expirationDate').textContent = `Data de Expiração: ${expirationDate}`;
    } else {
        document.getElementById('expirationDate').textContent = 'Data de Expiração não disponível';
    }
});

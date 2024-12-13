document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cnpj = urlParams.get('cnpj');
    
    if (cnpj) {
        document.getElementById('cnpjInfo').textContent = formatCNPJ(cnpj);
    } else {
        document.getElementById('cnpjInfo').textContent = 'CNPJ não disponível';
    }
});

// Função para formatar o CNPJ
function formatCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, ''); // Remove tudo o que não for número
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

document.getElementById('exibeModulos').addEventListener('click', async () => {
    // Reutilize a lógica de consulta de módulos aqui se necessário
    console.log('Verificando módulos...');
    try {
        const modulesData = await fetchModules(origin);
        // Verifique os módulos como já foi feito
    } catch (error) {
        console.error('Erro ao verificar módulos:', error);
    }
});


// Função para formatar a data no formato dd/MM/yyyy
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}


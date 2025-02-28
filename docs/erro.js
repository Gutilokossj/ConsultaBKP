document.addEventListener('DOMContentLoaded', () => {
    // Recupera o CNPJ armazenado no LocalStorage
    const cnpj = localStorage.getItem('cnpjDigitado');

    // Exibe o CNPJ formatado
    if (cnpj) {
        document.getElementById('cnpjInfo').textContent = `${formatCNPJ(cnpj)}`;
    } else {
        document.getElementById('cnpjInfo').textContent = 'CNPJ não disponível';
    }

});


// Função para formatar o CNPJ
function formatCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, ''); // Remove tudo o que não for número
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}


window.addEventListener('DOMContentLoaded', () => {
    const cnpj = localStorage.getItem('cnpjDigitado');

    if (cnpj) {
        const button = document.getElementById('exibeModulos');
        button.addEventListener('click', () => verificarModulos(cnpj)); // Passa o CNPJ ao clicar no botão
    } else {
        console.error('CNPJ não encontrado no localStorage');
    }
});

// Função para verificar os módulos
async function verificarModulos(cnpj) {
    if (!cnpj) {
        console.error('CNPJ não encontrado nos parâmetros da URL.');
        return;
    }

    // Define a origem inicial como SIEM
    let origin = 'SIEM';
    const apiModulesUrl = `https://servidor-proxy.vercel.app/proxy/release/`;

    try {
        const fetchModules = async (origin) => {
            const response = await fetch(apiModulesUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    document: cnpj,
                    origin: origin,
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao consultar a API de módulos com origem ${origin}`);
            }
            return await response.json();
        };

        // Primeira tentativa com origem SIEM
        let modulesData = await fetchModules(origin);

        if (modulesData.active) {
            // Redireciona para a página de resultado SIEM se o cliente estiver ativo
            window.location.href = `resultadoSIEM.html`;
            return;
        }

        // Se não for ativo no SIEM, tenta com GerencieAqui
        console.warn('Cliente não ativo no SIEM, tentando com GerencieAqui.');
        origin = 'GerencieAqui';

        try {
            modulesData = await fetchModules(origin);

            if (modulesData.active) {
                // Redireciona para a página de resultado GA se o cliente estiver ativo
                window.location.href = `resultadoGA.html`;
                return;
            }
        } catch (error) {
            console.error('Erro ao consultar a API com GerencieAqui:', error);
        }

    } catch (error) {
        console.error('Erro ao consultar a API:', error);
    }

    // Se nenhuma origem foi atendida, exibe uma mensagem no console
    console.warn('Nenhuma origem retornou dados ativos.');
}


window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cnpj = urlParams.get('cnpj');

    if (cnpj) {
        // Define a origem com base no estado do botão
        let origin = 'SIEM';

        try {
            const apiModulesUrl = `https://servidor-proxy.vercel.app/proxy/release/`;

            // Função para realizar a consulta de módulos
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

            // Primeira tentativa com origem 'SIEM'
            let modulesData = await fetchModules(origin);

            // Exibir a data de expiração na tela
            const expirationDate = modulesData.expirationDate;
            document.getElementById('expirationDate').textContent = expirationDate
                ? `${new Date(expirationDate + 'T00:00:00').toLocaleDateString('pt-BR')}`
                : 'Não disponível';

            if (modulesData.active) {
                // Cliente está ativo: redireciona para a página específica de SIEM.
                window.location.href = `resultadoSIEM.html?cnpj=${encodeURIComponent(cnpj)}`;
                return; // Finaliza a execução
            } 

            // Verifica se o CNPJ está ativo ou devendo
            if (!modulesData.active) {
                // Se não estiver ativo, mas houver benefícios, o cliente está devendo
                if (modulesData.benefits && modulesData.benefits.length > 0) {
                    console.warn('CNPJ está devendo, redirecionando para erroDevendo.html');
            
                    // Converte a data de expiração da API para o formato desejado
                    const expirationDate = modulesData.expirationDate;
                    const formattedExpirationDate = expirationDate ? formatDate(expirationDate) : 'Não disponível';
            
                    // Redireciona para erroDevendo.html com a data formatada
                    console.error('CNPJ devendo, redirecionando para erroDevendo.html');
                    window.location.href = `erroDevendo.html?cnpj=${encodeURIComponent(cnpj)}&expirationDate=${encodeURIComponent(formattedExpirationDate)}`;
                    return; // Para a execução caso o cliente esteja devendo
                } else {

                    // Cliente inativo e sem benefícios: tenta com "GerencieAqui".
                    console.warn('CNPJ inativo no SIEM, tentando com origem "GerencieAqui".');
                    origin = 'GerencieAqui';

                    try {
                        modulesData = await fetchModules(origin);

                        if (modulesData.active) {
                            // Cliente está ativo: redireciona para a página específica de GA.
                            window.location.href = `resultadoGA.html?cnpj=${encodeURIComponent(cnpj)}`;
                            return; // Finaliza a execução
                        } 

                    } catch (error) {
                        console.error('Erro ao consultar a API com "GerencieAqui":', error);
                    }
                }
             }

        } catch (error) {
                    console.error('Erro ao consultar a API:', error);
        }
        
        // Redireciona para erroCancelado.html caso nenhuma condição anterior seja atendida
        window.location.href = `erroCancelado.html?cnpj=${encodeURIComponent(cnpj)}`;
    
    }    

});


// Função para formatar a data no formato dd/MM/yyyy
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

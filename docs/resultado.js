window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cnpj = urlParams.get('cnpj');

    if (cnpj) {
         // Recupera o estado do botão de alternância
         const toggleState = localStorage.getItem('toggleState');
         const isActive = toggleState === 'active';
         
         // Define a origem com base no estado do botão
         const origin = isActive ? 'GerencieAqui' : 'SIEM';

        try {
            // Consulta à API de módulos primeiro para verificar se o CNPJ está ativo
            const apiModulesUrl = `https://servidor-proxy.vercel.app/proxy/release/`;
            const responseModules = await fetch(apiModulesUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    document: cnpj,
                    origin: origin,
                }),
            });

            if (!responseModules.ok) {
                throw new Error('Erro ao consultar a API de módulos');
            }

            const modulesData = await responseModules.json();
            console.log('Dados dos módulos recebidos da API:', modulesData);

            // Verifica se o CNPJ está ativo ou devendo
            if (!modulesData.active) {
                // Se não estiver ativo, mas houver benefícios, o cliente está devendo
                if (modulesData.benefits && modulesData.benefits.length > 0) {
                    console.warn('CNPJ está devendo, redirecionando para erroDevendo.html');
            
                    // Converte a data de expiração da API para o formato desejado
                    const expirationDate = modulesData.expirationDate;
                    const formattedExpirationDate = expirationDate ? formatDate(expirationDate) : 'Não disponível';
            
                    // Redireciona para erroDevendo.html com a data formatada
                    window.location.href = `erroDevendo.html?expirationDate=${encodeURIComponent(formattedExpirationDate)}`;
                    return; // Para a execução caso o cliente esteja devendo
                } else {
                    console.error('CNPJ cancelado, redirecionando para erroCancelado.html');
                    window.location.href = 'erroCancelado.html';
                    return; // Para a execução caso o CNPJ esteja cancelado
                }
            }

            // Se o CNPJ estiver ativo, continua para exibir os dados dos módulos
            const moduleElements = {
                'nfe': 'moduloNFe',
                'nfse': 'moduloNFSe',
                'nfce': 'moduloNFce',
                'sat': 'moduloSAT',
                'cte': 'moduloCTe',
                'mdfe': 'moduloMDFe',
                'financeiro': 'moduloFinanceiro',
                'comercial': 'moduloComercial',
                'farmacia' :'moduloFarmacia',
                'sped': 'moduloSPED',
                'pdv': 'moduloPDV',
                'estoque': 'moduloEstoque',
                'qtlicenca': 'moduloQtlicenca',
                'backup' : 'moduloBackup',
                'integracaociot' : 'moduloCiot'
            };

            // Esconder todos os módulos inicialmente
            Object.values(moduleElements).forEach(moduleId => {
                const moduleElement = document.getElementById(moduleId);
                if (moduleElement) {
                    moduleElement.style.display = 'none'; // Esconde todos os módulos
                }
            });

            // Exibir apenas os módulos retornados pela API
            modulesData.benefits.forEach(benefit => {
                const moduleId = moduleElements[benefit.name];
                if (moduleId) {
                    const moduleElement = document.getElementById(moduleId);
                    if (moduleElement) {
                        moduleElement.style.display = 'block'; // Exibe os módulos contratados
                    }
                }
            });

                // Recupera o CNPJ do LocalStorage
                const cnpjDigitado = localStorage.getItem('cnpjDigitado');

                // Se o CNPJ foi encontrado, exibe no campo de CNPJ com formatação
                if (cnpjDigitado) {
                    document.getElementById('cnpj').textContent = formatCNPJ(cnpjDigitado);
                        } else {
                                document.getElementById('cnpj').textContent = 'CNPJ não disponível';
                                }

                // Agora, consulta os dados de backup
                const apiUrl = `https://servidor-proxy.vercel.app/proxy/consulta/${cnpj}`;
                const responseBackup = await fetch(apiUrl);

                if (!responseBackup.ok) {
                    throw new Error('Erro ao consultar a API de backup');
                }

                const data = await responseBackup.json();
                console.log('Dados de backup recebidos da API:', data);

                // Atualiza os dados de backup no HTML, ou deixa "Não disponível" caso não existam
                document.getElementById('razaoSocial').textContent = data.razaoSocial || 'Não disponível';
                if (data.cnpjCpfString) {
                    document.getElementById('cnpj').textContent = formatCNPJ(data.cnpjCpfString);
                }
                document.getElementById('ultimoEnvio').textContent = `${data.ultimoEnvioContador ? new Date(data.ultimoEnvioContador).toLocaleString('pt-BR') : 'Não configurado'}`;
                document.getElementById('ultimoBackup').textContent = `${data.ultimoBackupBd ? new Date(data.ultimoBackupBd).toLocaleString('pt-BR') : 'Não disponível'}`;

                // Atualize o campo de dias sem backup
                if (data.ultimoBackupBd) {
                    const diasSemBKP = calcularDiasSemBackup(data.ultimoBackupBd);
                    document.getElementById('diasSemBKP').textContent = `${diasSemBKP} dias`;
                } else {
                    document.getElementById('diasSemBKP').textContent = 'Não disponível';
                }

            } catch (error) {
                console.error('Cliente não possuí BKP em Nuvem', error);
            } 
        } 
    });


document.addEventListener('DOMContentLoaded', () => {
    const exibeDetalhesButton = document.getElementById('exibeDetalhes');

    if (exibeDetalhesButton) {
        exibeDetalhesButton.addEventListener('click', () => {
            const cnpj = getQueryParam('cnpj');
            console.log('CNPJ obtido:', cnpj); // Adicione este log para verificar o valor do CNPJ
            if (cnpj) {
                const backupUrl = `resultado_BKP.html?cnpj=${encodeURIComponent(cnpj)}`;
                console.log('Redirecionando para:', backupUrl); // Adicione este log para verificar a URL
                window.location.href = backupUrl;
            } else {
                console.error('CNPJ não encontrado na URL.');
                window.location.href = 'erro.html';
            }
        });
    }
});

// Função para obter o parâmetro 'cnpj' da URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}


function formatCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');

    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

// Função para calcular a diferença de dias desde o último backup
function calcularDiasSemBackup(backupDateStr) {
    const backupDate = new Date(backupDateStr);
    const currentDate = new Date();

    const differenceInTime = currentDate.getTime() - backupDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays >= 0 ? differenceInDays : 0;
}

// Função que atualiza o status do backup
function updateBackupStatus(backupDateStr) {
    console.log('Data do Backup:', backupDateStr); // Verifica a data do backup recebida

    const backupDate = new Date(backupDateStr);
    const currentDate = new Date();

    const differenceInTime = currentDate.getTime() - backupDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    const backupStatusDiv = document.getElementById("backupStatus");
    const backupMessage = document.getElementById("backupMessage");

    backupStatusDiv.className = 'notification';

    if (differenceInDays === 0) {
        backupMessage.textContent = "EM DIA";
        backupStatusDiv.classList.add("on-time", "blinking");
    } else if (differenceInDays === 1 || differenceInDays === 2) {
        backupMessage.textContent = "ATRASADO";
        backupStatusDiv.classList.add("late", "blinking");
    } else {
        backupMessage.textContent = "MUITO ATRASADO";
        backupStatusDiv.classList.add("very-late", "blinking");
    }

    backupStatusDiv.classList.remove("hidden");
}

// Função para formatar a data no formato dd/MM/yyyy
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

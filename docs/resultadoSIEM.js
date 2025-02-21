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
                const data = await response.json();
                console.log(`Dados recebidos da API (origem: ${origin}):`, data); // Log dos dados recebidos
                return data;        
            }

         
            let modulesData = await fetchModules(origin);

            // Exibir a data de expiração na tela
            const expirationDate = modulesData.expirationDate;
            document.getElementById('expirationDate').textContent = expirationDate 
                ? `${new Date(expirationDate + 'T00:00:00').toLocaleDateString('pt-BR')}` 
                : 'Não disponível';

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
                'farmacia': 'moduloFarmacia',
                'sped': 'moduloSPED',
                'pdv': 'moduloPDV',
                'estoque': 'moduloEstoque',
                'backup': 'moduloBackup',
                'integracaociot': 'moduloCiot',
                'qtlicenca': 'qtlicencas',
                'android': 'moduloAndroid',
                'cloud': 'siemCloud',
                'integracaoapi': 'integracaoBB'
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

                // Puxar a quantidade de licenças
                if (benefit.name === 'qtlicenca') {
                    const qtlicencaValue = benefit.value;
                    document.getElementById('licencaValue').textContent = `${qtlicencaValue}`;
                }

                // Puxar a quantidade de usuários cloud
                if (benefit.name === 'cloud') {
                    const qtcloud= benefit.value;
                    document.getElementById('cloudValue').textContent = `Até ${qtcloud} Usuário(s)`;
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

                // Elementos do DOM
                const mensagemSemBackup = document.getElementById('mensagemSemBackup');
                const detalhesBackup = document.getElementById('detalhesBackup');

                        // Verifica se o cliente possui informações de backup
                        if (data.ultimoBackupBd || data.ultimoEnvioContador) {
                            // Cliente possui backup
                            mensagemSemBackup.style.display = 'none';
                            detalhesBackup.style.display = 'block';

                            // Atualiza os dados de backup no HTML
                            document.getElementById('razaoSocial').textContent = data.razaoSocial || 'Não disponível';
                            if (data.cnpjCpfString) {
                                document.getElementById('cnpj').textContent = formatCNPJ(data.cnpjCpfString);
                            }
                            document.getElementById('ultimoEnvio').textContent = data.ultimoEnvioContador
                                ? new Date(data.ultimoEnvioContador).toLocaleString('pt-BR')
                                : 'Não configurado';
                            document.getElementById('ultimoBackup').textContent = data.ultimoBackupBd
                                ? new Date(data.ultimoBackupBd).toLocaleString('pt-BR')
                                : 'Não disponível';

                            // Calcula e exibe os dias sem backup
                            if (data.ultimoBackupBd) {
                                const diasSemBKP = calcularDiasSemBackup(data.ultimoBackupBd);
                                document.getElementById('diasSemBKP').textContent = `${diasSemBKP} dias`;
                            } else {
                                document.getElementById('diasSemBKP').textContent = 'Não disponível';
                            }
                        } else {
                            // Cliente não possui backup
                            mensagemSemBackup.style.display = 'block';
                            detalhesBackup.style.display = 'none';
                        }
                    } catch (warn) {
                        console.warn('Cliente não possui BKP em Nuvem:', warn);

                        // Caso de erro na API, mostrar mensagem de ausência de backup
                        const mensagemSemBackup = document.getElementById('mensagemSemBackup');
                        const detalhesBackup = document.getElementById('detalhesBackup');

                        mensagemSemBackup.style.display = 'block';
                        detalhesBackup.style.display = 'none';
                    }
        } 
    });


document.addEventListener('DOMContentLoaded', () => {
    const exibeDetalhesButton = document.getElementById('exibeDetalhes');

    if (exibeDetalhesButton) {
        exibeDetalhesButton.addEventListener('click', () => {
            const cnpj = getQueryParam('cnpj');
            console.log('CNPJ obtido:', cnpj);
            if (cnpj) {
                const backupUrl = `resultado_BKP.html?cnpj=${encodeURIComponent(cnpj)}`;
                console.log('Redirecionando para:', backupUrl); // Adicione este log para verificar a URL
                window.location.href = backupUrl;
            } else {
                console.error('CNPJ não encontrado na URL.');
                window.location.href = `erro.html?cnpj=${encodeURIComponent(cnpj)}`;
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    carregarDados();

    function carregarDados() {
        // Exemplo de simulação de carregamento
        setTimeout(() => {
            // Quando os dados estiverem prontos, esconda o loading e mostre o conteúdo
            document.getElementById("loading").style.display = "none";
        }, 2000);
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

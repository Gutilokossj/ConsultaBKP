window.addEventListener('DOMContentLoaded', async (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const cnpj = urlParams.get('cnpj');

    if (cnpj) {
        try {
            const apiUrl = `https://servidor-proxy.vercel.app/proxy/consulta/${cnpj}`;
            console.log('Consultando API:', apiUrl); // Verifica a URL da API

            const response = await fetch(apiUrl);
            console.log('Resposta da API:', response); // Verifica o status da resposta

            if (!response.ok) {
                throw new Error('Erro ao consultar a API');
            }

            const data = await response.json();
            console.log('Dados recebidos da API:', data); // Verifica os dados recebidos

            if (data.mensagem === 'Empresa não localizada') {
                window.location.href = 'erro.html';
            } else {
                // Atualize os dados no HTML com a resposta da API
                document.getElementById('razaoSocial').textContent = data.razaoSocial || 'Não disponível';
                document.getElementById('cnpj').textContent = formatCNPJ(data.cnpjCpfString) || 'Não disponível';
                document.getElementById('ultimoEnvio').textContent = `${data.ultimoEnvioContador ? new Date(data.ultimoEnvioContador).toLocaleString('pt-BR') : 'Não configurado'}`;
                document.getElementById('ultimoBackup').textContent = `${data.ultimoBackupBd ? new Date(data.ultimoBackupBd).toLocaleString('pt-BR') : 'Não disponível'}`;

                // Atualize o campo de dias sem backup
                if (data.ultimoBackupBd) {
                    const diasSemBKP = calcularDiasSemBackup(data.ultimoBackupBd);
                    document.getElementById('diasSemBKP').textContent = `${diasSemBKP} dias`;
                } else {
                    document.getElementById('diasSemBKP').textContent = 'Não disponível';
                }

                // Verifique se a data de backup está disponível e atualize o status
                if (data.ultimoBackupBd) {
                    updateBackupStatus(data.ultimoBackupBd);
                }

                 // Consulta à API de módulos
                 const apiModulesUrl = `https://servidor-proxy.vercel.app/proxy/release/`;
                 const responseModules = await fetch(apiModulesUrl, {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({
                         document: cnpj,
                         origin: 'SIEM',
                     }),
                 });
 
                 if (!responseModules.ok) {
                     throw new Error('Erro ao consultar a API de módulos');
                 }
 
                 const modulesData = await responseModules.json();
                 console.log('Dados dos módulos recebidos da API:', modulesData);
 
                  // Verifique e atualize o status dos módulos no HTML
                const moduleElements = {
                    'nfe': 'moduloNFe',
                    'nfse': 'moduloNFSe',
                    'nfce': 'moduloNFce',
                    'sat': 'moduloSAT',
                    'cte': 'moduloCTe',
                    'mdfe': 'moduloMDFe',
                    'financeiro': 'moduloFinanceiro',
                    'comercial': 'moduloComercial',
                    'sped': 'moduloSPED',
                    'pdv': 'moduloPDV',
                    'estoque': 'moduloEstoque',
                    'qtlicenca': 'moduloQtlicenca'
                };

                console.log('Módulos recebidos:', modulesData.benefits);
                console.log('Elementos de módulo:', moduleElements);

                modulesData.benefits.forEach(benefit => {
                    const moduleId = moduleElements[benefit.name];
                    if (moduleId) {
                        const moduleElement = document.getElementById(moduleId);
                        if (moduleElement) {
                            const statusElement = moduleElement.querySelector('span');
                            if (statusElement) {
                                statusElement.textContent = 'Disponível';
                            }
                        }
                    }
                });
                    // Exibir mensagem para módulos não contratados
                    Object.values(moduleElements).forEach(moduleId => {
                        const moduleElement = document.getElementById(moduleId);
                        if (moduleElement) {
                            const statusElement = moduleElement.querySelector('span');
                            if (statusElement && statusElement.textContent === '') {
                                statusElement.textContent = 'Não disponível';
                            }
                        }
                    });
                }
             } catch (error) {
                console.error('Erro ao consultar a API:', error);
                window.location.href = 'erro.html';
                }
                    } else {
                    window.location.href = 'erro.html';
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

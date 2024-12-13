window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cnpj = urlParams.get('cnpj');

    if (cnpj) {

         // Define a origem com base no estado do botão
         let origin = 'GerencieAqui';

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
                console.log('Dados de envio XML recebidos da API:', data);

                // Elementos do DOM
                const mensagemSemBackup = document.getElementById('mensagemSemBackup');
                const detalhesBackup = document.getElementById('detalhesBackup');

                        // Verifica se o cliente possui informações de backup
                        if (!data.bloqueado) {
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
                                : 'Resetado ou não configurado';

                                // Calcula e exibe os dias sem envio XML
                                    const diasSemBKP = calcularDiasSemBackup(data.ultimoEnvioContador);
                                    document.getElementById('diasSemBKP').textContent = `${diasSemBKP} dias`;
                                } else {
                                    // Cliente não possui envio XML
                                    mensagemSemBackup.style.display = 'block';
                                    detalhesBackup.style.display = 'none';
                                }
                            } catch (warn) {
                                console.warn('Erro ao consultar API ou cliente sem envio XML:', warn);

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

function calcularDiasSemBackup(dataUltimoEnvio) {
    if (!dataUltimoEnvio) {
        // Se não houver último envio, retorna uma mensagem ou valor padrão
        return 'Não disponível';
    }

    const ultimoEnvio = new Date(dataUltimoEnvio); // Converte a string para um objeto Date
    if (isNaN(ultimoEnvio)) {
        // Verifica se a data é válida
        return 'Data inválida';
    }

    const hoje = new Date(); // Data atual
    const diferenca = hoje - ultimoEnvio; // Diferença em milissegundos
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24)); // Converte para dias
    return dias;
}


// Função para formatar a data no formato dd/MM/yyyy
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}
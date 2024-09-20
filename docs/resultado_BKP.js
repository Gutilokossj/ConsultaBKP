window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cnpj = urlParams.get('cnpj');
    console.log('CNPJ da URL:', cnpj);

    if (cnpj) {
        try {
            const apiUrl = `https://servidor-proxy.vercel.app/proxy/consulta/${cnpj}`;
            console.log('Consultando API:', apiUrl);

            const response = await fetch(apiUrl);
            console.log('Resposta da API:', response);

            if (!response.ok) {
                throw new Error('Erro ao consultar a API');
            }

            const data = await response.json();
            console.log('Dados recebidos da API:', data);

            if (data.mensagem === 'Empresa não localizada') {
                window.location.href = 'erro.html';
            } else {
                // Atualize os dados no HTML com a resposta da API
                document.getElementById('razaoSocial').textContent = data.razaoSocial || ' Não disponível';
                document.getElementById('cnpj').textContent = formatCNPJ(data.cnpjCpfString) || ' Não disponível';
                document.getElementById('dataCriacao').textContent = `${data.dataCriacao ? new Date(data.dataCriacao).toLocaleString('pt-BR') : 'Não disponível'}`;
                document.getElementById('tamanhoBKP').textContent = data.tamanhoMb || ' Não disponível'; // Verifique se esse campo existe na API
                document.getElementById('emailCopia').textContent = data.copiasemail || ' Não configurado'; // Verifique se esse campo existe na API
                document.getElementById('ultimoEnvio').textContent = `${data.ultimoEnvioContador ? new Date(data.ultimoEnvioContador).toLocaleString('pt-BR') : 'Não configurado'}`;
                document.getElementById('emailContador').textContent = data.emailContador || ' Não configurado'; // Verifique se esse campo existe na API
                document.getElementById('ultimoBackup').textContent = `${data.ultimoBackupBd ? new Date(data.ultimoBackupBd).toLocaleString('pt-BR') : 'Não disponível'}`;
                document.getElementById('ultimaValidacao').textContent = `${data.ultimaValidacaoApi ? new Date(data.ultimaValidacaoApi).toLocaleString('pt-BR') : 'Não disponível'}`;

                // Atualize o campo de dias sem backup
                const diasSemBKPElement = document.getElementById('diasSemBKP');
                if (diasSemBKPElement && data.ultimoBackupBd) {
                    const diasSemBKP = calcularDiasSemBackup(data.ultimoBackupBd);
                    diasSemBKPElement.textContent = `${diasSemBKP} dias`;
                } else if (diasSemBKPElement) {
                    diasSemBKPElement.textContent = 'Não disponível';
                }

                // Verifique se a data de backup está disponível e atualize o status
                if (data.ultimoBackupBd) {
                    updateBackupStatus(data.ultimoBackupBd);
                }
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
    const exibeModulosButton = document.getElementById('exibeModulos');

    if (exibeModulosButton) {
        exibeModulosButton.addEventListener('click', () => {
            const cnpj = getQueryParam('cnpj');
            console.log('CNPJ obtido:', cnpj);
            if (cnpj) {
                const backupUrl = `resultado.html?cnpj=${encodeURIComponent(cnpj)}`;
                console.log('Redirecionando para:', backupUrl);
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
    if (!cnpj) return 'Não disponível';

    // Remove qualquer caractere que não seja número
    cnpj = cnpj.replace(/\D/g, '');

    // Formata o CNPJ conforme o padrão XX.XXX.XXX/XXXX-XX
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

// Função para calcular a diferença de dias desde o último backup
function calcularDiasSemBackup(backupDateStr) {
    if (!backupDateStr) return 0;

    const backupDate = new Date(backupDateStr);
    const currentDate = new Date();

    const differenceInTime = currentDate.getTime() - backupDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays >= 0 ? differenceInDays : 0;
}

// Função que atualiza o status do backup com base na data
function updateBackupStatus(backupDateStr) {
    console.log('Data do Backup:', backupDateStr);

    const backupDate = new Date(backupDateStr);
    const currentDate = new Date();

    const differenceInTime = currentDate.getTime() - backupDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    const backupStatusDiv = document.getElementById("backupStatus");

    if (backupStatusDiv) {
        let statusHTML = ''; // Variável para armazenar o HTML da imagem de status
        let statusText = ''; // Variável para o texto

        // Atualizando a imagem do status com base na diferença de dias
        if (differenceInDays === 0) {
            statusHTML = '<img src="assets/backupemdia.png" alt="Status Em Dia">';
            
        } else if (differenceInDays === 1 || differenceInDays === 2) {
            statusHTML = '<img src="assets/atrasadobackup.png" alt="Status Atrasado">';
        } else {
            statusHTML = '<img src="assets/alertabackup.png" alt="Status Atenção">';
        }

        // Inserir o HTML da imagem e o texto no div de status
        backupStatusDiv.innerHTML = `${statusHTML}<p>${statusText}</p>`;
        
        // Exibir o div de status (remover classe 'hidden', caso exista)
        backupStatusDiv.classList.remove("hidden");
    }
}

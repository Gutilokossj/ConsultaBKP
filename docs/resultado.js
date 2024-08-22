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
                document.getElementById('cnpj').textContent = data.cnpjCpf || 'Não disponível'; // Ajustado para cnpjCpf
                document.getElementById('dataCriacao').textContent = `${data.dataCriacao ? new Date(data.dataCriacao).toLocaleString('pt-BR') : 'Não disponível'}`;
                document.getElementById('tamanhoBKP').textContent = data.tamanhoMb || 'Não disponível'; // Verifique se esse campo existe na API
                document.getElementById('emailCopia').textContent = data.copiasemail || 'Não configurado'; // Verifique se esse campo existe na API
                document.getElementById('ultimoEnvio').textContent = `${data.ultimoEnvioContador ? new Date(data.ultimoEnvioContador).toLocaleString('pt-BR') : 'Não configurado'}`; // Ajustado para ultimoEnvioContador
                document.getElementById('emailContador').textContent = data.emailContador || 'Não configurado'; // Verifique se esse campo existe na API
                document.getElementById('ultimoBackup').textContent = `${data.ultimoBackupBd ? new Date(data.ultimoBackupBd).toLocaleString('pt-BR') : 'Não disponível'}`;
                document.getElementById('ultimaValidacao').textContent = `${data.ultimaValidacaoApi ? new Date(data.ultimaValidacaoApi).toLocaleString('pt-BR') : 'Não disponível'}`;

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
        backupMessage.textContent = "BACKUP EM DIA";
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

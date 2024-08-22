window.addEventListener('DOMContentLoaded', async (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const cnpj = urlParams.get('cnpj');

    if (cnpj) {
        try {
            const apiUrl = `https://servidor-proxy.vercel.app/proxy/consulta/${cnpj}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Erro ao consultar a API');
            }

            const data = await response.json();
            const resultContainer = document.getElementById('result');

            // Formata os dados
            resultContainer.innerHTML = `
            <div class="section">
            <h3> DADOS CLIENTE </h3>
                <p><strong>CNPJ:</strong> ${data.cnpjCpfString || 'Não disponível'}</p>
                <p><strong>DATA CRIAÇÃO:</strong> ${data.dataCriacao ? new Date(data.dataCriacao).toLocaleString('pt-BR') : 'Não disponível'}</p>
                <p><strong>TAMANHO BKP:</strong> ${data.tamanhoMb || 'Não disponível'} MB</p>
                <h3> VERIFICAR BACKUP </h3>
                <p><strong>DATA/HORA ÚLTIMO BACKUP:</strong> ${data.ultimoBackupBd ? new Date(data.ultimoBackupBd).toLocaleString('pt-BR') : 'Não disponível'}</p>
                <p><strong>ÚLTIMA VALIDAÇÃO BKP:</strong> ${data.ultimaValidacaoApi ? new Date(data.ultimaValidacaoApi).toLocaleString('pt-BR') : 'Não disponível'}</p>
                <p><strong>EXPIRAÇÃO API:</strong> ${data.expiracaoApi ? `${data.expiracaoApi[2]}/${data.expiracaoApi[1]}/${data.expiracaoApi[0]}` : 'Não disponível'}</p>
            `;

            // Chama a função para atualizar o status do backup
            if (data.ultimoBackupBd) {
                updateBackupStatus(data.ultimoBackupBd);
            }
            
        } catch (error) {
            console.error('Erro:', error);
            document.getElementById('result').innerHTML = '<p>Erro ao consultar o backup.</p>';
        }
    } else {
        document.getElementById('result').innerHTML = '<p>Não foram encontrados resultados.</p>';
    }
});

// Função que atualiza o status do backup
function updateBackupStatus(backupDateStr) {
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


window.addEventListener('DOMContentLoaded', async (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const cnpj = urlParams.get('cnpj');

    if (cnpj) {
        try {
            // Use o URL do proxy ao invés da URL direta da API
            const response = await fetch(`https://servidor-proxy.vercel.app/consulta/${cnpj}`);
            if (!response.ok) {
                document.getElementById('result').innerHTML = '<p>Erro ao consultar o backup.</p>';
                return;
            }

            const data = await response.json();
            const resultContainer = document.getElementById('result');

            // Formata os dados
            resultContainer.innerHTML = `
                <p><strong>CNPJ CLIENTE:</strong> ${data.cnpjCpfString || 'Não disponível'}</p>
                <p><strong>DATA/HORA ÚLTIMO BACKUP:</strong> ${data.ultimoBackupBd ? new Date(data.ultimoBackupBd).toLocaleString('pt-BR') : 'Não disponível'}</p>
                <p><strong>DATA CRIAÇÃO:</strong> ${data.dataCriacao ? new Date(data.dataCriacao).toLocaleString('pt-BR') : 'Não disponível'}</p>
                <p><strong>TAMANHO BKP:</strong> ${data.tamanhoMb || 'Não disponível'} MB</p>
                <p><strong>ÚLTIMA VALIDAÇÃO BKP:</strong> ${data.ultimaValidacaoApi ? new Date(data.ultimaValidacaoApi).toLocaleString('pt-BR') : 'Não disponível'}</p>
                <p><strong>EXPIRAÇÃO API:</strong> ${data.expiracaoApi ? `${data.expiracaoApi[2]}/${data.expiracaoApi[1]}/${data.expiracaoApi[0]}` : 'Não disponível'}</p>
            `;
        } catch (error) {
            console.error('Erro:', error);
            document.getElementById('result').innerHTML = '<p>Erro ao consultar o backup.</p>';
        }
    } else {
        document.getElementById('result').innerHTML = '<p>Não foram encontrados resultados.</p>';
    }
});

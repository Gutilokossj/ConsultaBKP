document.addEventListener('DOMContentLoaded', () => {
    const consultarButton = document.getElementById('consultarButton');
    const resultados = document.getElementById('resultados');

    if (consultarButton) {
        consultarButton.addEventListener('click', async () => {
            const cnpj = document.getElementById('cnpjInput').value;

            if (!cnpj) {
                resultados.textContent = 'Por favor, insira um CNPJ.';
                return;
            }

            // Testa a primeira API
            const apiUrl1 = `https://servidor-proxy.vercel.app/proxy/consulta/${cnpj}`;
            try {
                const response1 = await fetch(apiUrl1);
                if (!response1.ok) {
                    throw new Error('Erro ao consultar a API 1');
                }
                const data1 = await response1.json();
                resultados.textContent = `Dados da API 1: ${JSON.stringify(data1, null, 2)}`;
            } catch (error) {
                resultados.textContent = `Erro ao consultar a API 1: ${error.message}`;
                return;
            }

            // Formata o CNPJ para o formato requerido pela API 2
            const formattedCNPJ = formatCNPJ(cnpj);

            // Testa a segunda API
            const apiUrl2 = `https://servidor-proxy.vercel.app/proxy/release/${cnpj}`;
            const postData = {
                document: formattedCNPJ,
                origin: 'SIEM',
                token: '0000000000972276318728136634554015351040452035258642456166472325640972276318728136634521661441618814104321228832361628209722763187281366345000000000000000000000000000000183728947554015351040452035259722763187281366345'
            };

            console.log('Dados a serem enviados para a API 2:', JSON.stringify(postData, null, 2)); // Log do JSON enviado

            try {
                const response2 = await fetch(apiUrl2, {
                    method: 'POST',  // Garante que o método é POST
                    headers: {
                        'Content-Type': 'application/json'  // Define o tipo de conteúdo como JSON
                    },
                    body: JSON.stringify(postData)  // Converte o objeto JavaScript para JSON
                });

                // Exibe o status da resposta e os cabeçalhos
                console.log('Status da resposta:', response2.status);  // Log do status da resposta
                console.log('Cabeçalhos da resposta:', [...response2.headers.entries()]);  // Log dos cabeçalhos da resposta

                if (!response2.ok) {
                    throw new Error('Erro ao consultar a API 2');
                }

                // Obtém o corpo da resposta como JSON
                const data2 = await response2.json();
                console.log('Corpo da resposta:', data2);  // Log do corpo da resposta
                
                // Atualiza o conteúdo da página com os dados recebidos
                resultados.textContent += `\nDados da API 2: ${JSON.stringify(data2, null, 2)}`;
            } catch (error) {
                resultados.textContent += `\nErro ao consultar a API 2: ${error.message}`;
            }
        });
    }

    // Função para formatar o CNPJ
    function formatCNPJ(cnpj) {
        // Remove caracteres não numéricos
        const onlyNumbers = cnpj.replace(/\D/g, '');
        // Formata para o padrão 'XX.XXX.XXX/XXXX-XX'
        return onlyNumbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }
});

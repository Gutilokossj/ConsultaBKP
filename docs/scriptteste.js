document.getElementById('apiForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const documentValue = document.getElementById('document').value; // Defina a variável correta

    const responseElement = document.getElementById('result');
    responseElement.innerHTML = 'Enviando...';

    try {
        const response = await fetch('https://servidor-proxy.vercel.app/proxy/release/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                document: documentValue, // Use a variável correta aqui
                origin: 'SIEM',
            }),
        });

        if (!response.ok) {
            throw new Error('Erro na resposta da API');
        }

        const data = await response.json();
        responseElement.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
    } catch (error) {
        responseElement.innerHTML = 'Erro: ' + error.message;
    }
});

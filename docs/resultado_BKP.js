    window.addEventListener('DOMContentLoaded', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const cnpj = urlParams.get('cnpj');

        if (cnpj) {

            try {

                const apiUrl = `https://servidor-proxy.vercel.app/proxy/consulta/${cnpj}`;;

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error('Erro ao consultar a API');
                }

                const data = await response.json();
                console.log('Dados recebidos da API:', data);

                if (data.mensagem === 'Empresa não localizada') {
                    window.location.href = `erro.html?cnpj=${encodeURIComponent(cnpj)}`;
                } else {

                    // Verifica se o dado de último backup existe
                    const ultimoBackupBd = data.ultimoBackupBd;

                    // Atualize os dados no HTML com a resposta da API
                    document.getElementById('razaoSocial').textContent = data.razaoSocial || ' Não disponível';
                    document.getElementById('cnpj').textContent = formatCNPJ(data.cnpjCpfString) || ' Não disponível';
                    document.getElementById('dataCriacao').textContent = `${data.dataCriacao ? new Date(data.dataCriacao).toLocaleString('pt-BR') : 'Não disponível'}`;
                    document.getElementById('tamanhoBKP').textContent = data.tamanhoMb || ' Não disponível'; // Verifique se esse campo existe na API
                    document.getElementById('emailCopia').innerHTML = (data.copiasemail ? data.copiasemail.replace(/;/g, '<br>') : ' Não configurado');
                    document.getElementById('ultimoEnvio').textContent = `${data.ultimoEnvioContador ? new Date(data.ultimoEnvioContador).toLocaleString('pt-BR') : 'Resetado ou Não configurado (Aguarde)'}`;
                    document.getElementById('emailContador').textContent = data.emailContador ? data.emailContador.replace(/;/g, '<br>') : 'Resetado ou não configurado'; // Verifique se esse campo existe na API

                    // Manipulação da div verificar-backup
                    if (ultimoBackupBd && ultimoBackupBd !== null) {
                        // Exibe a div verificar-backup se o último backup estiver disponível
                        document.querySelector('.verificar-backup').style.display = 'block';
                        
                        // Atualiza os dados de backup com os valores da API
                        document.getElementById('ultimoBackup').textContent = new Date(ultimoBackupBd).toLocaleString('pt-BR');
                        document.getElementById('ultimaValidacao').textContent = data.ultimaValidacaoApi ? new Date(data.ultimaValidacaoApi).toLocaleString('pt-BR') : 'Não disponível';
                        
                        // Atualiza o campo de dias sem backup
                        const diasSemBKPElement = document.getElementById('diasSemBKP');
                        if (diasSemBKPElement) {
                            const diasSemBKP = calcularDiasSemBackup(ultimoBackupBd);
                            diasSemBKPElement.textContent = `${diasSemBKP} dias`;
                        }
                        
                        // Atualiza o status de backup
                        updateBackupStatus(ultimoBackupBd);
                    } else {
                        // Se não houver dados para o último backup, oculta a div verificar-backup
                        document.querySelector('.verificar-backup').style.display = 'none';
                    }
                }
            } catch (error) {
                console.error('Erro ao consultar a API:', error);
                window.location.href = `erro.html?cnpj=${encodeURIComponent(cnpj)}`;
            }
        } else {
            window.location.href = `erro.html?cnpj=${encodeURIComponent(cnpj)}`;
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
                    window.location.href = `erro.html?cnpj=${encodeURIComponent(cnpj)}`;
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
                statusHTML = '<img src="assets/IconeBackup/backupemdia.png" alt="Status Em Dia">';
                
            } else if (differenceInDays === 1 || differenceInDays === 2) {
                statusHTML = '<img src="assets/IconeBackup/atrasadobackup.png" alt="Status Atrasado">';
            } else {
                statusHTML = '<img src="assets/IconeBackup/alertabackup.png" alt="Status Atenção">';
            }

            // Inserir o HTML da imagem e o texto no div de status
            backupStatusDiv.innerHTML = `${statusHTML}<p>${statusText}</p>`;
            
            // Exibir o div de status (remover classe 'hidden', caso exista)
            backupStatusDiv.classList.remove("hidden");
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        // Função para obter o CNPJ da URL
        function obterCNPJ() {
            const params = new URLSearchParams(window.location.search);
            return params.get('cnpj');
        }

        // Função para fazer o reset via DELETE
        async function resetarEnvio(cnpj) {
            try {
                const response = await fetch(`https://servidor-proxy.vercel.app/proxy/resetEnvio/${cnpj}`, {
                    method: 'DELETE',  // Usando DELETE corretamente
                });
                
                if (response.ok) {
                    const message = await response.text();  // Obtém a mensagem retornada como texto
                    exibirMensagemSucesso(message);  // Exibe a mensagem retornada
                } else {
                    exibirMensagemSucesso("Erro ao resetar envio XML.");
                }
            } catch (error) {
                exibirMensagemSucesso("Erro na requisição: " + error.message);
            }
        }


        // Função para exibir mensagem de sucesso
        function exibirMensagemSucesso(mensagem) {
            const responseMessage = document.getElementById('responseMessage');
            responseMessage.textContent = mensagem;
            responseMessage.className = "response-message success show";
            responseMessage.style.display = 'block';

            // Remover a mensagem após 5 segundos
            setTimeout(function() {
                responseMessage.classList.remove('show');
                setTimeout(function() {
                    responseMessage.style.display = 'none';
                }, 500); // Tempo da animação
            }, 5000);
        }

        // Abrir o pop-up
        document.getElementById('resetaXML').addEventListener('click', function() {
            document.getElementById('customPopup').style.display = 'flex';
        });

            // Inserir senha e validar
            document.getElementById('inserirSenha').addEventListener('click', function() {
                // Pega o valor do input de senha e remove espaços extras
                const senha = document.getElementById('senhaReset').value.trim();

                // Verifica se o campo está vazio
                if (!senha) {
                    alert("Por favor, preencha a senha.");
                    return;
                }

                // Verificação da senha
                fetch(`https://servidor-proxy.vercel.app/proxy/validarSenha`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ senha }) // Envia a senha para o backend
                })
                .then(response => response.json())
                .then(data => {
                    if (data.valid) {  // Se a resposta for válida
                        // Exibir o botão "SIM, CONFIRMAR"
                        document.getElementById('confirmReset').classList.add('show');
                        document.getElementById('cancelReset').classList.add('show');

                        // Esconder o botão "INSERIR SENHA"
                        document.getElementById('inserirSenha').style.display = 'none';
                        document.getElementById('cancelResetSenha').style.display = 'none';
                    } else {
                        alert("Senha incorreta. Tente novamente.");
                    }
                })
                .catch(error => {
                    console.error('Erro ao validar a senha:', error);
                    alert("Erro na validação da senha.");
                });
            });

        // Confirmar e resetar envio
        document.getElementById('confirmReset').addEventListener('click', function() {
            const cnpj = obterCNPJ(); // Obter CNPJ da URL

            if (cnpj) {
                resetarEnvio(cnpj); // Chamar a função de reset com o CNPJ
            } else {
                exibirMensagemSucesso("CNPJ não encontrado na URL.");
            }

            document.getElementById('customPopup').style.display = 'none'; // Fechar o pop-up
        });

            document.getElementById('cancelReset').addEventListener('click', function() {
                document.getElementById('customPopup').style.display = 'none'; // Fechar o pop-up
            });
        });

            document.getElementById('cancelResetSenha').addEventListener('click', function() {
            document.getElementById('customPopup').style.display = 'none'; // Fechar o pop-up
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
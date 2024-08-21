import express from 'express';
import path from 'path';
import cors from 'cors'; // Importa o pacote cors

const app = express();
const port = 3001;

// Configuração do CORS
app.use(cors({
  origin: 'https://consulta-bkp.vercel.app', // Permite solicitações apenas deste domínio
  methods: ['GET', 'POST'], // Permite métodos específicos
}));

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Exemplo de rota para consulta (ajuste conforme necessário)
app.get('/consulta/:cnpj', (req, res) => {
  // Lógica para consultar o CNPJ e retornar os dados
  // Exemplo de resposta
  res.json({
    cnpjCpfString: req.params.cnpj,
    razaoSocial: 'Exemplo Ltda',
    ultimoBackupBd: '2023-08-21',
    dataCriacao: '2021-01-01',
    tamanhoMb: 150,
    expiracaoApi: ['2024-01-01'],
    bloqueado: false
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

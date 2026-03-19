const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const cursoRoutes = require('./src/routes/cursoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para log de todas as requisições
app.use((req, res, next) => {
    console.log(`🌐 ${req.method} ${req.url}`);
    next();
});

// Rotas da API
app.use('/api', cursoRoutes);

// Rota raiz com documentação da API
app.get('/', (req, res) => {
    res.status(200).json({
        nome: 'API de Cursos Online',
        versao: '1.0.0',
        descricao: 'Backend para sistema de venda de cursos online',
        endpoints: {
            listar_cursos: {
                metodo: 'GET',
                url: '/api/cursos',
                descricao: 'Lista todos os cursos'
            },
            buscar_curso: {
                metodo: 'GET',
                url: '/api/cursos/:id',
                descricao: 'Busca um curso específico pelo ID'
            },
            cursos_por_nivel: {
                metodo: 'GET',
                url: '/api/cursos/nivel/:nivel',
                descricao: 'Filtra cursos por nível (iniciante, intermediario, avancado)'
            },
            cursos_com_vagas: {
                metodo: 'GET',
                url: '/api/cursos/com-vagas',
                descricao: 'Lista apenas cursos com vagas disponíveis'
            },
            estatisticas: {
                metodo: 'GET',
                url: '/api/cursos/estatisticas',
                descricao: 'Estatísticas dos cursos'
            },
            criar_curso: {
                metodo: 'POST',
                url: '/api/cursos',
                descricao: 'Cria um novo curso',
                body: {
                    nome: 'string (obrigatório)',
                    descricao: 'text',
                    data_inicio: 'date (obrigatório)',
                    preco: 'decimal (obrigatório)',
                    instrutor: 'string (obrigatório)',
                    vagas_totais: 'number (obrigatório)',
                    nivel: 'string (iniciante/intermediario/avancado)',
                    categoria: 'string'
                }
            },
            atualizar_curso: {
                metodo: 'PUT',
                url: '/api/cursos/:id',
                descricao: 'Atualiza um curso completamente'
            },
            atualizar_parcial: {
                metodo: 'PATCH',
                url: '/api/cursos/:id',
                descricao: 'Atualiza parcialmente um curso'
            },
            deletar_curso: {
                metodo: 'DELETE',
                url: '/api/cursos/:id',
                descricao: 'Remove um curso'
            },
            reservar_vagas: {
                metodo: 'POST',
                url: '/api/cursos/:id/reservar',
                descricao: 'Reserva vagas em um curso',
                body: {
                    quantidade: 'number (obrigatório)'
                }
            }
        },
        documentacao: 'Use Postman ou Insomnia para testar a API'
    });
});

// Rota 404 para endpoints não encontrados
app.use('*', (req, res) => {
    res.status(404).json({
        sucesso: false,
        erro: 'Endpoint não encontrado'
    });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error('❌ Erro interno:', err.stack);
    res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('\n' + '=' . repeat(50));
    console.log(`🚀 SERVIDOR RODANDO NA PORTA ${PORT}`);
    console.log('=' . repeat(50));
    console.log(`📌 Documentação: http://localhost:${PORT}`);
    console.log(`📌 API Cursos: http://localhost:${PORT}/api/cursos`);
    console.log('=' . repeat(50));
});
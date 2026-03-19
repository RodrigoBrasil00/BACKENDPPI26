const express = require('express');
const router = express.Router();
const CursoController = require('../controllers/CursoController');

// Criar uma instância do controller
const controller = new CursoController();

// Middleware para log de requisições (opcional)
router.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
});

// Rotas GET (consultas)
router.get('/cursos', (req, res) => controller.listarCursos(req, res));
router.get('/cursos/estatisticas', (req, res) => controller.estatisticas(req, res));
router.get('/cursos/com-vagas', (req, res) => controller.buscarComVagas(req, res));
router.get('/cursos/nivel/:nivel', (req, res) => controller.buscarPorNivel(req, res));
router.get('/cursos/:id', (req, res) => controller.buscarCursoPorId(req, res));

// Rotas POST (criação)
router.post('/cursos', (req, res) => controller.criarCurso(req, res));
router.post('/cursos/:id/reservar', (req, res) => controller.reservarVagas(req, res));

// Rotas PUT (atualização completa)
router.put('/cursos/:id', (req, res) => controller.atualizarCurso(req, res));

// Rotas PATCH (atualização parcial)
router.patch('/cursos/:id', (req, res) => controller.atualizarParcial(req, res));

// Rotas DELETE (exclusão)
router.delete('/cursos/:id', (req, res) => controller.deletarCurso(req, res));

module.exports = router;
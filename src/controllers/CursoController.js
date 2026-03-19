const CursoService = require('../services/CursoService');

class CursoController {
    constructor() {
        this.service = new CursoService();
    }

    
    async listarCursos(req, res) {
        try {
            console.log('📋 listarCursos foi chamado!');
            const cursos = await this.service.listarTodos();
            res.status(200).json({
                sucesso: true,
                dados: cursos,
                quantidade: cursos.length
            });
        } catch (error) {
            console.error('❌ Erro em listarCursos:', error);
            res.status(500).json({
                sucesso: false,
                erro: error.message
            });
        }
    }

    
    async buscarCursoPorId(req, res) {
        try {
            const { id } = req.params;
            const curso = await this.service.buscarPorId(id);
            
            res.status(200).json({
                sucesso: true,
                dados: curso
            });
        } catch (error) {
            const status = error.message.includes('não encontrado') ? 404 : 500;
            res.status(status).json({
                sucesso: false,
                erro: error.message
            });
        }
    }

    
    async criarCurso(req, res) {
        try {
            console.log('📥 Criar curso - dados:', req.body);
            
            const novoCurso = await this.service.criar(req.body);
            
            res.status(201).json({
                sucesso: true,
                mensagem: 'Curso criado com sucesso',
                dados: novoCurso
            });
            
        } catch (error) {
            console.error('❌ Erro em criarCurso:', error);
            res.status(500).json({
                sucesso: false,
                erro: error.message
            });
        }
    }

    
    async atualizarCurso(req, res) {
        try {
            const { id } = req.params;
            
            const cursoAtualizado = await this.service.atualizar(id, req.body);
            
            res.status(200).json({
                sucesso: true,
                mensagem: 'Curso atualizado com sucesso',
                dados: cursoAtualizado
            });
        } catch (error) {
            const status = error.message.includes('não encontrado') ? 404 : 400;
            res.status(status).json({
                sucesso: false,
                erro: error.message
            });
        }
    }

    
    async atualizarParcial(req, res) {
        try {
            const { id } = req.params;
            
            const cursoExistente = await this.service.buscarPorId(id);
            
            const dadosAtualizados = {
                ...cursoExistente,
                ...req.body
            };
            
            const cursoAtualizado = await this.service.atualizar(id, dadosAtualizados);
            
            res.status(200).json({
                sucesso: true,
                mensagem: 'Curso atualizado parcialmente com sucesso',
                dados: cursoAtualizado
            });
        } catch (error) {
            const status = error.message.includes('não encontrado') ? 404 : 400;
            res.status(status).json({
                sucesso: false,
                erro: error.message
            });
        }
    }

    
    async deletarCurso(req, res) {
        try {
            const { id } = req.params;
            console.log('🗑️ Deletar curso ID:', id);
            
            const resultado = await this.service.deletar(id);
            
            res.status(200).json({
                sucesso: true,
                mensagem: resultado.mensagem
            });
            
        } catch (error) {
            console.error('❌ Erro em deletarCurso:', error);
            const status = error.message.includes('não encontrado') ? 404 : 500;
            res.status(status).json({
                sucesso: false,
                erro: error.message
            });
        }
    }

    
    async buscarPorNivel(req, res) {
        try {
            const { nivel } = req.params;
            const cursos = await this.service.buscarPorNivel(nivel);
            
            res.status(200).json({
                sucesso: true,
                dados: cursos,
                quantidade: cursos.length
            });
        } catch (error) {
            res.status(400).json({
                sucesso: false,
                erro: error.message
            });
        }
    }

    
    async buscarComVagas(req, res) {
        try {
            const cursos = await this.service.buscarComVagas();
            
            res.status(200).json({
                sucesso: true,
                dados: cursos,
                quantidade: cursos.length
            });
        } catch (error) {
            res.status(500).json({
                sucesso: false,
                erro: error.message
            });
        }
    }

    
    async reservarVagas(req, res) {
        try {
            const { id } = req.params;
            const { quantidade } = req.body;
            
            const resultado = await this.service.reservarVagas(id, quantidade);
            
            res.status(200).json({
                sucesso: true,
                mensagem: resultado.mensagem,
                vagas_restantes: resultado.vagas_restantes
            });
        } catch (error) {
            const status = error.message.includes('não encontrado') ? 404 : 
                          error.message.includes('insuficientes') ? 400 : 500;
            res.status(status).json({
                sucesso: false,
                erro: error.message
            });
        }
    }

    
    async estatisticas(req, res) {
        try {
            const stats = await this.service.obterEstatisticas();
            
            res.status(200).json({
                sucesso: true,
                dados: stats
            });
        } catch (error) {
            res.status(500).json({
                sucesso: false,
                erro: error.message
            });
        }
    }
}

module.exports = CursoController;
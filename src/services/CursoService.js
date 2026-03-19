const CursoRepository = require('../repositories/CursoRepository');

class CursoService {
    constructor() {
        this.repository = new CursoRepository();
    }

    
    async listarTodos() {
        try {
            return await this.repository.findAll();
        } catch (error) {
            throw new Error('Erro ao listar cursos: ' + error.message);
        }
    }

    
    async buscarPorId(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID inválido');
            }

            const curso = await this.repository.findById(parseInt(id));
            if (!curso) {
                throw new Error('Curso não encontrado');
            }
            return curso;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    
    async criar(dados) {
        try {
            console.log('📦 Service.criar - dados:', dados);
            
            
            if (!dados.vagas_disponiveis && dados.vagas_totais) {
                dados.vagas_disponiveis = dados.vagas_totais;
            }

            
            const CursoModel = require('../models/Curso');
            const cursoModel = new CursoModel(dados);
            const validacao = cursoModel.validar();
            
            if (!validacao.valido) {
                throw new Error('Dados inválidos: ' + validacao.erros.join(', '));
            }

            const cursoCriado = await this.repository.create(dados);
            return cursoCriado;
            
        } catch (error) {
            console.error('❌ Service.criar - erro:', error);
            throw error;
        }
    }

    
    async atualizar(id, dados) {
        try {
            console.log('📝 Service.atualizar - ID:', id, 'Dados:', dados);
            
            if (!id || isNaN(id)) {
                throw new Error('ID inválido');
            }

            
            const cursoExistente = await this.repository.findById(parseInt(id));
            if (!cursoExistente) {
                throw new Error('Curso não encontrado');
            }

            
            if (!dados.vagas_disponiveis && dados.vagas_totais) {
                dados.vagas_disponiveis = dados.vagas_totais;
            }

            
            const CursoModel = require('../models/Curso');
            const cursoModel = new CursoModel(dados);
            const validacao = cursoModel.validar();
            
            if (!validacao.valido) {
                throw new Error('Dados inválidos: ' + validacao.erros.join(', '));
            }

            
            const cursoAtualizado = await this.repository.update(parseInt(id), dados);
            
            if (!cursoAtualizado) {
                throw new Error('Erro ao atualizar curso');
            }
            
            console.log('✅ Service.atualizar - sucesso:', cursoAtualizado);
            return cursoAtualizado;
            
        } catch (error) {
            console.error('❌ Service.atualizar - erro:', error);
            throw error;
        }
    }

    
    async atualizarParcial(id, dados) {
        try {
            console.log('📝 Service.atualizarParcial - ID:', id, 'Dados:', dados);
            
            if (!id || isNaN(id)) {
                throw new Error('ID inválido');
            }

            
            const cursoExistente = await this.repository.findById(parseInt(id));
            if (!cursoExistente) {
                throw new Error('Curso não encontrado');
            }

            
            const dadosAtualizados = {
                ...cursoExistente,
                ...dados
            };

            
            const CursoModel = require('../models/Curso');
            const cursoModel = new CursoModel(dadosAtualizados);
            const validacao = cursoModel.validar();
            
            if (!validacao.valido) {
                throw new Error('Dados inválidos: ' + validacao.erros.join(', '));
            }

            
            const cursoAtualizado = await this.repository.update(parseInt(id), dadosAtualizados);
            
            console.log('✅ Service.atualizarParcial - sucesso:', cursoAtualizado);
            return cursoAtualizado;
            
        } catch (error) {
            console.error('❌ Service.atualizarParcial - erro:', error);
            throw error;
        }
    }

    
    async deletar(id) {
        try {
            console.log('🗑️ Service.deletar - ID:', id);
            
            if (!id || isNaN(id)) {
                throw new Error('ID inválido');
            }

            
            const cursoExistente = await this.repository.findById(parseInt(id));
            if (!cursoExistente) {
                throw new Error('Curso não encontrado');
            }

            const deletado = await this.repository.delete(parseInt(id));
            
            if (!deletado) {
                throw new Error('Não foi possível deletar o curso');
            }
            
            console.log('✅ Service.deletar - sucesso para ID:', id);
            return { mensagem: 'Curso deletado com sucesso' };
            
        } catch (error) {
            console.error('❌ Service.deletar - erro:', error);
            throw error;
        }
    }

    
    async buscarPorNivel(nivel) {
        try {
            const niveisValidos = ['iniciante', 'intermediario', 'avancado'];
            if (!niveisValidos.includes(nivel)) {
                throw new Error('Nível inválido. Use: iniciante, intermediario ou avancado');
            }

            return await this.repository.findByNivel(nivel);
        } catch (error) {
            throw new Error('Erro ao buscar cursos por nível: ' + error.message);
        }
    }

    
    async buscarComVagas() {
        try {
            return await this.repository.findWithAvailableVagas();
        } catch (error) {
            throw new Error('Erro ao buscar cursos com vagas: ' + error.message);
        }
    }

    
    async reservarVagas(id, quantidade) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID inválido');
            }

            if (!quantidade || quantidade <= 0) {
                throw new Error('Quantidade inválida');
            }

            const curso = await this.repository.findById(parseInt(id));
            if (!curso) {
                throw new Error('Curso não encontrado');
            }

            if (curso.vagas_disponiveis < quantidade) {
                throw new Error(`Vagas insuficientes. Disponíveis: ${curso.vagas_disponiveis}`);
            }

            const sucesso = await this.repository.updateVagas(parseInt(id), quantidade);
            if (!sucesso) {
                throw new Error('Não foi possível reservar as vagas');
            }
            
            const cursoAtualizado = await this.repository.findById(parseInt(id));
            return {
                mensagem: `${quantidade} vaga(s) reservada(s) com sucesso`,
                vagas_restantes: cursoAtualizado.vagas_disponiveis
            };
            
        } catch (error) {
            throw new Error('Erro ao reservar vagas: ' + error.message);
        }
    }

    
    async obterEstatisticas() {
        try {
            const todos = await this.repository.findAll();
            const comVagas = await this.repository.findWithAvailableVagas();
            
            return {
                total_cursos: todos.length,
                cursos_com_vagas: comVagas.length,
                por_nivel: {
                    iniciante: todos.filter(c => c.nivel === 'iniciante').length,
                    intermediario: todos.filter(c => c.nivel === 'intermediario').length,
                    avancado: todos.filter(c => c.nivel === 'avancado').length
                },
                preco_medio: todos.reduce((acc, c) => acc + c.preco, 0) / todos.length || 0
            };
        } catch (error) {
            throw new Error('Erro ao obter estatísticas: ' + error.message);
        }
    }
}

module.exports = CursoService;
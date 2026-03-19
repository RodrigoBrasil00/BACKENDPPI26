const db = require('../config/database');
const Curso = require('../models/Curso');

class CursoRepository {
    
    // Buscar todos os cursos
    async findAll() {
        try {
            const [rows] = await db.query('SELECT * FROM cursos ORDER BY data_inicio');
            return rows.map(row => new Curso(row));
        } catch (error) {
            console.error('Erro ao buscar cursos:', error);
            throw error;
        }
    }

    // Buscar curso por ID
    async findById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM cursos WHERE id = ?', [id]);
            if (rows.length === 0) return null;
            return new Curso(rows[0]);
        } catch (error) {
            console.error('Erro ao buscar curso por ID:', error);
            throw error;
        }
    }

    // Inserir novo curso
    async create(cursoData) {
        try {
            console.log('📝 Repository.create - recebido:', cursoData);
            
            const curso = new Curso(cursoData);
            
            // Executar o INSERT
            const [result] = await db.query(
                `INSERT INTO cursos (
                    nome, descricao, data_inicio, data_fim, duracao_semanas, 
                    preco, carga_horaria, instrutor, nivel, vagas_totais, 
                    vagas_disponiveis, categoria, requisitos
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    curso.nome, 
                    curso.descricao || '', 
                    curso.data_inicio, 
                    curso.data_fim || null, 
                    curso.duracao_semanas || 0, 
                    curso.preco, 
                    curso.carga_horaria || 0, 
                    curso.instrutor, 
                    curso.nivel || 'iniciante', 
                    curso.vagas_totais, 
                    curso.vagas_disponiveis || curso.vagas_totais, 
                    curso.categoria || '', 
                    curso.requisitos || ''
                ]
            );

            console.log('✅ Repository.create - ID gerado:', result.insertId);
            
            // Buscar o curso recém-criado para retornar com todos os dados
            const [rows] = await db.query('SELECT * FROM cursos WHERE id = ?', [result.insertId]);
            
            if (rows.length === 0) {
                throw new Error('Erro ao recuperar curso criado');
            }
            
            const cursoCriado = new Curso(rows[0]);
            
            // Retornar o objeto completo
            return cursoCriado;
            
        } catch (error) {
            console.error('❌ Repository.create - erro:', error);
            throw error;
        }
    }

    // Atualizar curso
    async update(id, cursoData) {
        try {
            const curso = new Curso(cursoData);
            
            const [result] = await db.query(
                `UPDATE cursos SET 
                    nome = ?, descricao = ?, data_inicio = ?, data_fim = ?, 
                    duracao_semanas = ?, preco = ?, carga_horaria = ?, 
                    instrutor = ?, nivel = ?, vagas_totais = ?, 
                    vagas_disponiveis = ?, categoria = ?, requisitos = ?
                WHERE id = ?`,
                [
                    curso.nome, curso.descricao, curso.data_inicio, curso.data_fim,
                    curso.duracao_semanas, curso.preco, curso.carga_horaria,
                    curso.instrutor, curso.nivel, curso.vagas_totais,
                    curso.vagas_disponiveis, curso.categoria, curso.requisitos, id
                ]
            );

            if (result.affectedRows === 0) return null;
            
            return await this.findById(id);
        } catch (error) {
            console.error('Erro ao atualizar curso:', error);
            throw error;
        }
    }

    // Atualizar vagas disponíveis
    async updateVagas(id, quantidade) {
        try {
            const [result] = await db.query(
                `UPDATE cursos SET vagas_disponiveis = vagas_disponiveis - ? 
                WHERE id = ? AND vagas_disponiveis >= ?`,
                [quantidade, id, quantidade]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao atualizar vagas:', error);
            throw error;
        }
    }

    // Deletar curso
    async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM cursos WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao deletar curso:', error);
            throw error;
        }
    }

    // Buscar cursos com vagas disponíveis
    async findWithAvailableVagas() {
        try {
            const [rows] = await db.query('SELECT * FROM cursos WHERE vagas_disponiveis > 0');
            return rows.map(row => new Curso(row));
        } catch (error) {
            console.error('Erro ao buscar cursos com vagas:', error);
            throw error;
        }
    }
}

module.exports = CursoRepository;
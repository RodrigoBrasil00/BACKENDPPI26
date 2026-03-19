class Curso {
    constructor(data = {}) {
        this.id = data.id || null;
        this.nome = data.nome || '';
        this.descricao = data.descricao || '';
        this.data_inicio = data.data_inicio || null;
        this.data_fim = data.data_fim || null;
        this.duracao_semanas = data.duracao_semanas || 0;
        this.preco = data.preco || 0;
        this.carga_horaria = data.carga_horaria || 0;
        this.instrutor = data.instrutor || '';
        this.nivel = data.nivel || 'iniciante';
        this.vagas_totais = data.vagas_totais || 0;
        this.vagas_disponiveis = data.vagas_disponiveis || 0;
        this.categoria = data.categoria || '';
        this.requisitos = data.requisitos || '';
        this.created_at = data.created_at || null;
        this.updated_at = data.updated_at || null;
    }

    
    validar() {
        const erros = [];

        if (!this.nome || this.nome.length < 3) {
            erros.push('Nome do curso deve ter pelo menos 3 caracteres');
        }

        if (!this.preco || this.preco <= 0) {
            erros.push('Preço deve ser maior que zero');
        }

        if (!this.instrutor) {
            erros.push('Instrutor é obrigatório');
        }

        if (!this.vagas_totais || this.vagas_totais <= 0) {
            erros.push('Vagas totais deve ser maior que zero');
        }

        const niveisValidos = ['iniciante', 'intermediario', 'avancado'];
        if (!niveisValidos.includes(this.nivel)) {
            erros.push('Nível deve ser: iniciante, intermediario ou avancado');
        }

        return {
            valido: erros.length === 0,
            erros: erros
        };
    }

    
    toJSON() {

        
    const formatarDataBR = (data) => {
        if (!data) return null;
        const d = new Date(data);
        if (isNaN(d.getTime())) return data; 
        return d.toLocaleDateString('pt-BR');
    };      

        return {
            id: this.id,
            nome: this.nome,
            descricao: this.descricao,
            data_inicio: this.data_inicio,
            data_fim: this.data_fim,
            duracao_semanas: this.duracao_semanas,
            preco: this.preco,
            carga_horaria: this.carga_horaria,
            instrutor: this.instrutor,
            nivel: this.nivel,
            vagas_totais: this.vagas_totais,
            vagas_disponiveis: this.vagas_disponiveis,
            categoria: this.categoria,
            requisitos: this.requisitos
        };
    }
}

module.exports = Curso;
const CursoService = require('../services/CursoService');

async function executarTestes() {
    console.log('='.repeat(50));
    console.log('INICIANDO TESTES DO BACKEND DE CURSOS');
    console.log('='.repeat(50));

    const service = new CursoService();

    try {
        
        console.log('\n📚 TESTE 1: Listar todos os cursos');
        const cursos = await service.listarTodos();
        console.log(`✅ Encontrados ${cursos.length} cursos`);
        cursos.forEach(curso => {
            console.log(`   - ${curso.nome} (R$ ${curso.preco}) - ${curso.vagas_disponiveis} vagas`);
        });

        
        console.log('\n🔍 TESTE 2: Buscar curso por ID (ID: 1)');
        const curso = await service.buscarPorId(1);
        console.log(`✅ Curso encontrado: ${curso.nome}`);
        console.log(`   Descrição: ${curso.descricao.substring(0, 50)}...`);
        console.log(`   Instrutor: ${curso.instrutor}`);

        
        console.log('\n📊 TESTE 3: Buscar cursos por nível (iniciante)');
        const cursosIniciante = await service.buscarPorNivel('iniciante');
        console.log(`✅ Encontrados ${cursosIniciante.length} cursos para iniciantes`);

        
        console.log('\n🟢 TESTE 4: Buscar cursos com vagas disponíveis');
        const cursosComVagas = await service.buscarComVagas();
        console.log(`✅ ${cursosComVagas.length} cursos com vagas disponíveis`);

        
        console.log('\n➕ TESTE 5: Criar novo curso');
        const novoCurso = await service.criar({
            nome: 'Python para Data Science',
            descricao: 'Aprenda Python focado em análise de dados e machine learning',
            data_inicio: '2024-06-01',
            duracao_semanas: 10,
            preco: 1499.99,
            carga_horaria: 100,
            instrutor: 'Carlos Santos',
            nivel: 'intermediario',
            vagas_totais: 20,
            vagas_disponiveis: 20,
            categoria: 'Data Science',
            requisitos: 'Conhecimentos básicos de programação'
        });
        console.log(`✅ Curso criado com ID: ${novoCurso.id}`);

        
        console.log('\n🎫 TESTE 6: Reservar vagas no curso');
        const reserva = await service.reservarVagas(novoCurso.id, 2);
        console.log(`✅ ${reserva.mensagem}`);
        console.log(`   Vagas restantes: ${reserva.vagas_restantes}`);

        
        console.log('\n✏️ TESTE 7: Atualizar curso');
        const cursoAtualizado = await service.atualizar(novoCurso.id, {
            preco: 1299.99,
            vagas_totais: 25,
            vagas_disponiveis: 23
        });
        console.log(`✅ Curso atualizado: ${cursoAtualizado.nome}`);
        console.log(`   Novo preço: R$ ${cursoAtualizado.preco}`);

        
        console.log('\n📈 TESTE 8: Estatísticas dos cursos');
        const stats = await service.obterEstatisticas();
        console.log('   Estatísticas:');
        console.log(`   - Total de cursos: ${stats.total_cursos}`);
        console.log(`   - Cursos com vagas: ${stats.cursos_com_vagas}`);
        console.log(`   - Distribuição por nível:`, stats.por_nivel);
        console.log(`   - Preço médio: R$ ${stats.preco_medio.toFixed(2)}`);

        
        console.log('\n⚠️ TESTE 9: Tentar reservar mais vagas que disponíveis');
        try {
            await service.reservarVagas(novoCurso.id, 100);
        } catch (error) {
            console.log(`✅ Erro esperado: ${error.message}`);
        }

        
        console.log('\n🗑️ TESTE 10: Deletar curso');
        const deletado = await service.deletar(novoCurso.id);
        console.log(`✅ Curso deletado com sucesso`);

        console.log('\n' + '='.repeat(50));
        console.log('✅ TODOS OS TESTES CONCLUÍDOS COM SUCESSO!');
        console.log('='.repeat(50));

    } catch (error) {
        console.error('\n❌ ERRO DURANTE OS TESTES:');
        console.error(error);
    }
}


executarTestes();
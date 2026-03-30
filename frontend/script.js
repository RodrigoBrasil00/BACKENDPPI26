const API = "http://localhost:3000/api/cursos";


async function carregarCursos() {
    try {
        const res = await fetch(API);
        const data = await res.json();

        const tabela = document.getElementById("tabelaCursos");
        tabela.innerHTML = "";

        data.dados.forEach(curso => {
            tabela.innerHTML += `
                <tr>
                    <td>${curso.id}</td>
                    <td>${curso.nome}</td>
                    <td>${curso.instrutor}</td>
                    <td>R$ ${curso.preco}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editar(${curso.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deletar(${curso.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        mostrarAlerta("Erro ao carregar cursos", "danger");
        console.error(error);
    }
}


document.getElementById("formCurso").addEventListener("submit", async function(e) {
    e.preventDefault();

    const id = document.getElementById("id").value;

    const curso = {
        nome: document.getElementById("nome").value,
        descricao: document.getElementById("descricao").value,
        data_inicio: document.getElementById("data_inicio").value,
        preco: parseFloat(document.getElementById("preco").value),
        instrutor: document.getElementById("instrutor").value,
        vagas_totais: parseInt(document.getElementById("vagas_totais").value),
        vagas_disponiveis: parseInt(document.getElementById("vagas_totais").value),
        nivel: "intermediario",
        categoria: "Geral"
    };

    
    if (!curso.nome || !curso.preco || !curso.instrutor) {
        mostrarAlerta("Preencha os campos obrigatórios!", "danger");
        return;
    }

    try {
        if (id) {
            
            await fetch(`${API}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(curso)
            });

            mostrarAlerta("Curso atualizado com sucesso!", "warning");
        } else {
            
            await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(curso)
            });

            mostrarAlerta("Curso criado com sucesso!", "success");
        }

        limparForm();
        carregarCursos();

    } catch (error) {
        mostrarAlerta("Erro ao salvar curso", "danger");
        console.error(error);
    }
});


async function editar(id) {
    try {
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();
        const c = data.dados;

        document.getElementById("id").value = c.id;
        document.getElementById("nome").value = c.nome;
        document.getElementById("descricao").value = c.descricao;
        document.getElementById("preco").value = c.preco;
        document.getElementById("instrutor").value = c.instrutor;
        document.getElementById("vagas_totais").value = c.vagas_totais;

        
        document.getElementById("data_inicio").value = c.data_inicio.split("T")[0];

    } catch (error) {
        mostrarAlerta("Erro ao carregar curso", "danger");
        console.error(error);
    }
}


async function deletar(id) {
    if (!confirm("Deseja excluir este curso?")) return;

    try {
        await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        mostrarAlerta("Curso deletado com sucesso!", "danger");
        carregarCursos();

    } catch (error) {
        mostrarAlerta("Erro ao deletar curso", "danger");
        console.error(error);
    }
}


function mostrarAlerta(msg, tipo) {
    document.getElementById("alerta").innerHTML = `
        <div class="alert alert-${tipo} mt-2">${msg}</div>
    `;

    
    setTimeout(() => {
        document.getElementById("alerta").innerHTML = "";
    }, 3000);
}


function limparForm() {
    document.getElementById("formCurso").reset();
    document.getElementById("id").value = "";
}


carregarCursos();
function gerarRecibo() {
    let cliente = document.getElementById("cliente").value.trim();
    let telefone = document.getElementById("telefone").value.trim();
    let descricao = document.getElementById("descricao").value.trim();
    let valor = document.getElementById("valor").value.trim();
    let data = new Date().toLocaleDateString('pt-BR');

    // Validação do campo telefone
    if (cliente && telefone && descricao && valor) {
        if (!validarTelefone(telefone)) {
            alert("Telefone inválido! O telefone deve conter exatamente 11 dígitos numéricos.");
            return;
        }

        if (!validarValor(valor)) {
            alert("Valor inválido! Insira um valor numérico válido (ex: 100,00).");
            return;
        }

        document.getElementById("reciboCliente").innerText = cliente;
        document.getElementById("reciboTelefone").innerText = formatarTelefone(telefone);
        document.getElementById("reciboDescricao").innerText = descricao;
        document.getElementById("receiptValor").textContent = valor; // Formata o valor
        document.getElementById("reciboData").innerText = data;

        document.getElementById("recibo").style.display = "block";
        salvarReciboNoHistorico();
        alert("Recibo gerado com sucesso!");
    } else {
        alert("Preencha todos os campos!");
    }
}


// Função para validar o telefone
function validarTelefone(telefone) {
    const telefoneNumerico = telefone.replace(/\D/g, '');
    return telefoneNumerico.length === 11;
}




// Função para formatar o telefone no padrão (XX) XXXXX-XXXX
function formatarTelefone(telefone) {
    const telefoneNumerico = telefone.replace(/\D/g, '');
    return `(${telefoneNumerico.substring(0, 2)}) ${telefoneNumerico.substring(2, 7)}-${telefoneNumerico.substring(7)}`;
}

// Função para formatar o valor no padrão R$ X.XXX,XX
if (valor) {
    // Formata o valor com duas casas decimais e substitui o ponto por vírgula
    valor = parseFloat(valor).toFixed(2).replace(".", ",");
  } else {
    valor = "__,__";
  

}

// Função para salvar o recibo no histórico
function salvarReciboNoHistorico() {
    const recibo = {
        cliente: document.getElementById("reciboCliente").innerText,
        telefone: document.getElementById("reciboTelefone").innerText,
        descricao: document.getElementById("reciboDescricao").innerText,
        valor: document.getElementById("reciboValor").innerText,
        data: document.getElementById("reciboData").innerText
    };

    let historico = JSON.parse(localStorage.getItem("historicoRecibos")) || [];
    historico.push(recibo);
    localStorage.setItem("historicoRecibos", JSON.stringify(historico));

    carregarHistorico();
}

// Função para carregar o histórico de recibos
function carregarHistorico() {
    const historico = JSON.parse(localStorage.getItem("historicoRecibos")) || [];
    const listaRecibos = document.getElementById("listaRecibos");
    listaRecibos.innerHTML = "";

    historico.forEach((recibo, index) => {
        const item = document.createElement("li");
        item.innerHTML = `
            <strong>Cliente:</strong> ${recibo.cliente}<br>
            <strong>Telefone:</strong> ${recibo.telefone}<br>
            <strong>Descrição:</strong> ${recibo.descricao}<br>
            <strong>Valor:</strong> ${recibo.valor}<br>
            <strong>Data:</strong> ${recibo.data}<br>
            <button onclick="visualizarRecibo(${index})">Visualizar</button>
            <button class="btnExcluir" onclick="excluirRecibo(${index})">Excluir</button>
        `;
        listaRecibos.appendChild(item);
    });
}

// Função para visualizar um recibo do histórico
function visualizarRecibo(index) {
    const historico = JSON.parse(localStorage.getItem("historicoRecibos")) || [];
    const recibo = historico[index];

    document.getElementById("reciboCliente").innerText = recibo.cliente;
    document.getElementById("reciboTelefone").innerText = recibo.telefone;
    document.getElementById("reciboDescricao").innerText = recibo.descricao;
    document.getElementById("reciboValor").innerText = recibo.valor;
    document.getElementById("reciboData").innerText = recibo.data;

    document.getElementById("recibo").style.display = "block";
}

// Função para excluir um recibo do histórico
function excluirRecibo(index) {
    let historico = JSON.parse(localStorage.getItem("historicoRecibos")) || [];
    historico.splice(index, 1);
    localStorage.setItem("historicoRecibos", JSON.stringify(historico));
    carregarHistorico();
}

// Carrega o histórico ao abrir a página
window.onload = carregarHistorico;
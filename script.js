function gerarRecibo() {
    let cliente = document.getElementById("cliente").value.trim();
    let telefone = document.getElementById("telefone").value.trim();
    let descricao = document.getElementById("descricao").value.trim();
    let valor = document.getElementById("valor").value.trim();
    let data = new Date().toLocaleDateString('pt-BR');

    // Validações
    if (!cliente || !telefone || !descricao || !valor) {
        alert("Preencha todos os campos!");
        return;
    }

    if (!validarTelefone(telefone)) {
        alert("Telefone inválido! O telefone deve conter exatamente 11 dígitos numéricos.");
        return;
    }

    if (!validarValor(valor)) {
        alert("Valor inválido! Insira um valor numérico válido (ex: 100,00).");
        return;
    }

    // Formatar valor
    valor = parseFloat(valor.replace(",", ".")).toFixed(2).replace(".", ",");

    // Preencher os campos do recibo
    document.getElementById("reciboCliente").innerText = cliente;
    document.getElementById("reciboTelefone").innerText = formatarTelefone(telefone);
    document.getElementById("reciboDescricao").innerText = descricao;
    document.getElementById("reciboValor").innerText = `R$ ${valor}`;
    document.getElementById("reciboData").innerText = data;

    document.getElementById("recibo").style.display = "block";
    salvarReciboNoHistorico();
    alert("Recibo gerado com sucesso!");
}

function validarTelefone(telefone) {
    const telefoneNumerico = telefone.replace(/\D/g, '');
    return telefoneNumerico.length === 11;
}

function formatarTelefone(telefone) {
    const telefoneNumerico = telefone.replace(/\D/g, '');
    return `(${telefoneNumerico.substring(0, 2)}) ${telefoneNumerico.substring(2, 7)}-${telefoneNumerico.substring(7)}`;
}

function validarValor(valor) {
    return /^\d+(,\d{1,2})?$/.test(valor);
}

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

window.onload = carregarHistorico;
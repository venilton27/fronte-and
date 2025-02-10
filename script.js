function gerarRecibo() {
    let cliente = document.getElementById("cliente").value.trim();
    let telefone = document.getElementById("telefone").value.trim();
    let descricao = document.getElementById("descricao").value.trim();
    let data = new Date().toLocaleDateString('pt-BR');

    if (cliente && telefone && descricao) {
        if (!validarTelefone(telefone)) {
            alert("Telefone inválido! Insira um número válido.");
            return;
        }

        document.getElementById("reciboCliente").innerText = cliente;
        document.getElementById("reciboTelefone").innerText = telefone;
        document.getElementById("reciboDescricao").innerText = descricao;
        document.getElementById("reciboData").innerText = data;

        document.getElementById("recibo").style.display = "block";
        salvarReciboNoHistorico();
        alert("Recibo gerado com sucesso!");
    } else {
        alert("Preencha todos os campos!");
    }
}

function validarTelefone(telefone) {
    const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
    return regex.test(telefone);
}

function imprimirRecibo() {
    let recibo = document.getElementById("recibo").cloneNode(true);
    recibo.querySelector("#btnImprimir").remove();
    recibo.querySelector("#btnWhatsApp").remove();
    recibo.querySelector("#btnPDF").remove();

    let printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Recibo</title>');
    printWindow.document.write('<link rel="stylesheet" href="styles.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(recibo.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function enviarWhatsApp() {
    let telefone = document.getElementById("reciboTelefone").innerText;
    let telefoneNumerico = telefone.replace(/\D/g, '');

    if (telefoneNumerico.length < 10) {
        alert("Número de telefone inválido!");
        return;
    }

    let cliente = document.getElementById("reciboCliente").innerText;
    let descricao = document.getElementById("reciboDescricao").innerText;
    let data = document.getElementById("reciboData").innerText;

    let mensagem = `Recibo%0A--------------------%0A📌 Empresa: Nome da Empresa%0A📌 CNPJ: 00.000.000/0000-00%0A👤 Cliente: ${cliente}%0A📞 Telefone: ${telefone}%0A📝 Descrição: ${descricao}%0A📅 Data: ${data}`;

    let link = `https://wa.me/55${telefoneNumerico}?text=${mensagem}`;
    window.open(link, '_blank');
}

function salvarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const empresa = "Nome da Empresa";
    const cnpj = "00.000.000/0000-00";
    const cliente = document.getElementById("reciboCliente").innerText;
    const telefone = document.getElementById("reciboTelefone").innerText;
    const descricao = document.getElementById("reciboDescricao").innerText;
    const data = document.getElementById("reciboData").innerText;

    doc.setFontSize(18);
    doc.text("Recibo", 10, 20);
    doc.setFontSize(12);
    doc.text(`Empresa: ${empresa}`, 10, 30);
    doc.text(`CNPJ: ${cnpj}`, 10, 40);
    doc.text(`Cliente: ${cliente}`, 10, 50);
    doc.text(`Telefone: ${telefone}`, 10, 60);
    doc.text(`Descrição: ${descricao}`, 10, 70);
    doc.text(`Data: ${data}`, 10, 80);

    doc.save("recibo.pdf");
}

function salvarReciboNoHistorico() {
    const recibo = {
        cliente: document.getElementById("reciboCliente").innerText,
        telefone: document.getElementById("reciboTelefone").innerText,
        descricao: document.getElementById("reciboDescricao").innerText,
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
            <strong>Data:</strong> ${recibo.data}<br>
            <button onclick="visualizarRecibo(${index})">Visualizar</button>
            <button class="btnExcluir" onclick="excluirRecibo(${index})">Excluir</button>
        `;
        listaRecibos.appendChild(item);
    });
}

function visualizarRecibo(index) {
    const historico = JSON.parse(localStorage.getItem("historicoRecibos")) || [];
    const recibo = historico[index];

    document.getElementById("reciboCliente").innerText = recibo.cliente;
    document.getElementById("reciboTelefone").innerText = recibo.telefone;
    document.getElementById("reciboDescricao").innerText = recibo.descricao;
    document.getElementById("reciboData").innerText = recibo.data;

    document.getElementById("recibo").style.display = "block";
}

function excluirRecibo(index) {
    let historico = JSON.parse(localStorage.getItem("historicoRecibos")) || [];
    historico.splice(index, 1);
    localStorage.setItem("historicoRecibos", JSON.stringify(historico));
    carregarHistorico();
}

window.onload = carregarHistorico;
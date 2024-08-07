const chave_transcoes_ls = "transacoes";
const form = document.getElementById("form");
const descInput = document.getElementById("descricao");
const valorInput = document.querySelector("#montante");
const balancoH1 = document.getElementById("balanco");
const receitaP = document.querySelector("#din-positivo");
const despesaP = document.querySelector("#din-negativo");
const transacoesUL = document.getElementById("transacoes");

let transacoesSalvas;
let valorAtualID = -1; 

try {
  transacoesSalvas = JSON.parse(localStorage.getItem(chave_transcoes_ls));
} catch (erro) {
  transacoesSalvas = null;
}

if (transacoesSalvas == null) {
  transacoesSalvas = [];
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const descTransacao = descInput.value.trim();
  const valorTransacao = valorInput.value.trim();
  const tipoSelecionado = document.querySelector('input[name="tipo"]:checked');

  if (!tipoSelecionado) {
    alert("Selecione o tipo da transação!");
    return;
  }
  const tipoTransacao = tipoSelecionado.value;

  if (valorTransacao == "") {
    alert("Informe o valor da transação!");
    valorInput.focus();
    return;
  }

  const transacao = {
    id: ++valorAtualID,
    desc: descTransacao,
    valor: parseFloat(valorTransacao),
    tipo: tipoTransacao,
  };

  somaAoSaldo(transacao);
  somaRecitaDespesa(transacao);
  addTransacaoAoDOM(transacao);

  // Adiconando ao vetor de transações
  transacoesSalvas.push(transacao);
  // Salvando no Local Storage
  localStorage.setItem(chave_transcoes_ls, JSON.stringify(transacoesSalvas));

  descInput.value = "";
  valorInput.value = "";
  tipoSelecionado = document.querySelectorAll('input[name="tipo"]').forEach(radio => radio.checked = false);
});

function somaAoSaldo(transacao) {
  let valorBalanco = balancoH1.innerHTML.trim();
  valorBalanco = valorBalanco.replace("R$", "");

  valorBalanco = parseFloat(valorBalanco);
  
  
  if (transacao.tipo === "despesa") {
    valorBalanco -= transacao.valor;
  } else { 
    valorBalanco += transacao.valor;
  }

  balancoH1.innerHTML = `R$${valorBalanco.toFixed(2)}`;
}

function somaRecitaDespesa(transacao) {
  const elemento = transacao.tipo === "receita" ? receitaP : despesaP;
  const substituir = transacao.tipo === "receita" ? "+ R$" : "- R$";
  let valor = elemento.innerHTML.replace(substituir, "");
  valor = parseFloat(valor);
  valor += Math.abs(transacao.valor);

  elemento.innerHTML = `${substituir}${valor.toFixed(2)}`;
}

function addTransacaoAoDOM(transacao) {
  const cssClass = transacao.tipo === "receita" ? "positivo" : "negativo";

  const currency = transacao.tipo === "receita" ? "R$" : "-R$";

  const liElementStr = `${transacao.desc} <span>${currency}${Math.abs(transacao.valor)}
    </span><button class="delete-btn" onclick="deletaTransacao(${transacao.id})">X</button>`;

  const liElement = document.createElement("li");
  liElement.classList.add(cssClass);
  liElement.innerHTML = liElementStr;
  transacoesUL.append(liElement);
}

function carregarDados() {
  transacoesUL.innerHTML = "";
  balancoH1.innerHTML = "R$0.00";
  receitaP.innerHTML = "+ R$0.00";
  despesaP.innerHTML = "- R$0.00";

  valorAtualID = parseInt(localStorage.getItem('valorAtualID')) || -1; 

  for (let i = 0; i < transacoesSalvas.length; i++) {
    let transacao = transacoesSalvas[i];
    somaAoSaldo(transacao);
    somaRecitaDespesa(transacao);
    addTransacaoAoDOM(transacao);

    
  }
  // Salva o valorAtualID atualizado no Local Storage
  localStorage.setItem('valorAtualID', valorAtualID.toString());
}

function deletaTransacao(id) {
  const transacaoIndex = transacoesSalvas.findIndex(
    (transacao) => transacao.id == id
  );

  transacoesSalvas.splice(transacaoIndex, 1);

  localStorage.setItem(chave_transcoes_ls, JSON.stringify(transacoesSalvas));

  carregarDados();
}

carregarDados();

const receitaRadio = document.getElementById("receita");
const despesaRadio = document.getElementById("despesa");

receitaRadio.addEventListener("change", function () {
  if (receitaRadio.checked) {
    valorInput.style.backgroundColor = "#2e7d30"; 
    valorInput.style.color = "#fff"; 
  }
});

despesaRadio.addEventListener("change", function () {
  if (despesaRadio.checked) {
    valorInput.style.backgroundColor = "#c62820"; 
    valorInput.style.color = "#fff"; 
  }
});

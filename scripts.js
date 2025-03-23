// Seleciona os elementos do formulário
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleciona os elementos da lista de despesas
const expensesList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const expensesTotalValue = document.querySelector("aside header h2");

// O evento de input é disparado sempre que o valor do campo é alterado
amount.oninput = () => {
  // Remove todos os caracteres não numéricos do campo
  let value = amount.value.replace(/\D/g, "");

  //Transforma o valor em centavos
  value = Number(value) / 100;

  // Atualiza o valor do campo com o novo valor
  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  // Formata o valor para o formato de moeda brasileira
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Retorna o valor formatado
  return value;
}

// Captura o evento de submit do formulário para adicionar uma nova despesa
form.onsubmit = (event) => {
  // Desabilita o comportamento padrão de recarregar a página
  event.preventDefault();

  // Cria um objeto com os dados da nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  //chama a função para adicionar a despesa
  expenseAdd(newExpense);
};

// Adiciona a despesa na lista de despesas
function expenseAdd(newExpense) {
  try {
    // Cria o item de despesa (li) para adicionar na lista (ul)
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // Cria o icone da categoria da despesa
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // Cria o Informação da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    // Cria o nome da despesa
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    // Cria o categoria da despesa
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Adiciona o nome e a categoria da despesa dentro da div de informações
    expenseInfo.append(expenseName, expenseCategory);

    // Cria o valor da despesa
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    // Cria o botão de excluir
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "Remover despesa");

    // Adiciona as inforções no item da despesa
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    // Adiciona o item da despesa na lista que aparece na tela
    expensesList.append(expenseItem);

    // Atualiza a quantidade de itens na lista
    updateTotalExpenses();

    clearForm();
  } catch (error) {
    alert("Não foi possível adicionar a despesa");
    console.error(error);
  }
}

// Atualizar a quantidade de itens na lista
function updateTotalExpenses() {
  try {
    // Recupera a quantidade de itens (li) da lista de despesas (lu)
    const totalItems = expensesList.children;

    // Atualiza a quantidade de despesas na tela
    expensesQuantity.textContent = `${totalItems.length} ${
      totalItems.length > 1 ? "despesas" : "despesa"
    } `;

    // Calcula o valor total das despesas
    let totalAmount = 0;

    // Percorre cada item da lista de despesas
    for (let item = 0; item < totalItems.length; item++) {
      const itemAmount = totalItems[item].querySelector(".expense-amount");

      //Remover caracteres não numéricos e substituir a vírgula por ponto
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      //Transforma o valor em float
      value = parseFloat(value);

      // Verifica se o valor é um número
      if (isNaN(value)) {
        return alert("Valor inválido");
      }

      // Soma o valor da despesa ao total
      totalAmount += Number(value);

      console.log(totalAmount);
    }

    // Cria a span para adicionar o R$ formatado
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    // Formata o valor e remove o R$, que será adicionado na small com estilo customizado
    totalAmount = formatCurrencyBRL(totalAmount)
      .toUpperCase()
      .replace("R$", "");

    // Limpa o valor total de despesas
    expensesTotalValue.innerHTML = "";

    // Adiciona o valor total formatado
    expensesTotalValue.append(symbolBRL, totalAmount);
  } catch (error) {
    alert("Não foi possível atualizar o total de despesas");
    console.error(error);
  }
}

// Captura o evento de clique na lista de despesas
expensesList.addEventListener("click", (event) => {
  // Verifica se o elemento clicado é o botão de excluir
  if (event.target.classList.contains("remove-icon")) {
    // Obtem o item (li) da despesa
    const expenseItem = event.target.closest(".expense");

    // Remove o item da lista de despesas
    expenseItem.remove();
  }

  // Atualiza a quantidade e o valor total das despesas
  updateTotalExpenses();
});

// Função para limpar o formulário
function clearForm() {
  // Limpa os campos do formulário
  expense.value = "";
  amount.value = "";
  category.selectedIndex = 0;

  // Coloca o foco no campo de despesa
  expense.focus();
}

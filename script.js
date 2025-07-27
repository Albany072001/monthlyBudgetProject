let form = document.getElementById('budget-form');
let tableBody = document.getElementById('budget-table-body');
let totalIncomeDisplay = document.getElementById('total-income');
let totalExpenseDisplay = document.getElementById('total-expense');
let netSavingsDisplay = document.getElementById('net-savings');

let transactions = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  let description = document.getElementById('description').value.trim();
  let amountInput = parseFloat(document.getElementById('amount').value);
  let category = document.getElementById('category').value;

  if (!description || isNaN(amountInput) || amountInput <=0) return;
  
  let amount = category.toLowerCase() === 'income' ? amountInput : - amountInput;

  let transaction = { description, amount, category };
  transactions.push(transaction);
  updateTable();
  updateSummary();

  form.reset();
});

function updateTable() {
  tableBody.innerHTML = '';
  transactions.forEach((t) => {
    let row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.description}</td>
      <td style="color:${t.amount >= 0 ? 'green' : 'red'}">$${Math.abs(t.amount).toFixed(2)}</td>
      <td>${t.category}</td>
    `;
    tableBody.appendChild(row);
  });
}

function updateSummary() {
  let income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  let expenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
  let net = income + expenses;

  totalIncomeDisplay.textContent = income.toFixed(2);
  totalExpenseDisplay.textContent = Math.abs(expenses).toFixed(2);
  netSavingsDisplay.textContent = net.toFixed(2);
}

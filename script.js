const form = document.getElementById('budget-form');
const tableBody = document.getElementById('budget-table-body');
const totalIncomeDisplay = document.getElementById('total-income');
const totalExpenseDisplay = document.getElementById('total-expense');
const netSavingsDisplay = document.getElementById('net-savings');

let transactions = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  if (!description || isNaN(amount)) return;

  const transaction = { description, amount, category };
  transactions.push(transaction);
  updateTable();
  updateSummary();

  form.reset();
});

function updateTable() {
  tableBody.innerHTML = '';
  transactions.forEach((t) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.description}</td>
      <td style="color:${t.amount >= 0 ? 'green' : 'red'}">$${Math.abs(t.amount).toFixed(2)}</td>
      <td>${t.category}</td>
    `;
    tableBody.appendChild(row);
  });
}

function updateSummary() {
  const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
  const net = income + expenses;

  totalIncomeDisplay.textContent = income.toFixed(2);
  totalExpenseDisplay.textContent = Math.abs(expenses).toFixed(2);
  netSavingsDisplay.textContent = net.toFixed(2);
}

let editIndex = -1;  // -1 means no edit in progress

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

  if (!description || isNaN(amountInput) || amountInput <= 0) return;

  // Automatically determine sign: positive for income, negative for others
  let amount = category.toLowerCase() === 'income' ? amountInput : -amountInput;

  if (editIndex === -1) {
    // Add new transaction
    transactions.push({ description, amount, category });
  } else {
    // Update existing transaction
    transactions[editIndex] = { description, amount, category };
    editIndex = -1;
    form.querySelector('button[type="submit"]').textContent = 'Add';
  }

  updateTable();
  updateSummary();
  form.reset();
});

function updateTable() {
  tableBody.innerHTML = '';
  transactions.forEach((t, index) => {
    let row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.description}</td>
      <td style="color:${t.amount >= 0 ? 'green' : 'red'}">$${Math.abs(t.amount).toFixed(2)}</td>
      <td>${t.category}</td>
      <td>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Delete buttons
  tableBody.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.dataset.index;
      transactions.splice(idx, 1);
      updateTable();
      updateSummary();
      resetForm();
    });
  });

  // Edit buttons
  tableBody.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.dataset.index;
      populateFormForEdit(idx);
    });
  });
}

function populateFormForEdit(index) {
  const t = transactions[index];
  document.getElementById('description').value = t.description;
  document.getElementById('amount').value = Math.abs(t.amount);
  document.getElementById('category').value = t.category;

  editIndex = index;
  form.querySelector('button[type="submit"]').textContent = 'Update';
}

function updateSummary() {
  let income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  let expenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
  let net = income + expenses;

  totalIncomeDisplay.textContent = income.toFixed(2);
  totalExpenseDisplay.textContent = Math.abs(expenses).toFixed(2);
  netSavingsDisplay.textContent = net.toFixed(2);
}

function resetForm() {
  editIndex = -1;
  form.querySelector('button[type="submit"]').textContent = 'Add';
  form.reset();
}

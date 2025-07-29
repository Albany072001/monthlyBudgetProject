let editIndex = -1;

const form = document.getElementById('budget-form');
const fixedBody = document.getElementById('fixed-table-body');
const variableBody = document.getElementById('variable-table-body');
const totalIncomeDisplay = document.getElementById('total-income');
const totalExpenseDisplay = document.getElementById('total-expense');
const netSavingsDisplay = document.getElementById('net-savings');

let transactions = [];

// Preset user fixed expense categories - editable if you want later
let userFixedCategories = ['Housing', 'Utilities', 'Insurance', 'Entertainment'];

// Check if expense is fixed
function isFixedExpense(transaction) {
  return transaction.amount < 0 && userFixedCategories.includes(transaction.category);
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const description = document.getElementById('description').value.trim();
  const amountInput = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  if (!description || isNaN(amountInput) || amountInput <= 0) return;

  // Income is positive, expenses are negative
  const amount = category === 'Income' ? amountInput : -amountInput;

  if (editIndex === -1) {
    // Check if similar transaction exists (same description + category)
    const existingIndex = transactions.findIndex(t =>
      t.description.toLowerCase() === description.toLowerCase() &&
      t.category.toLowerCase() === category.toLowerCase()
    );

    if (existingIndex !== -1) {
      // Merge amounts for duplicates
      transactions[existingIndex].amount += amount;
    } else {
      transactions.push({ description, amount, category });
    }
  } else {
    transactions[editIndex] = { description, amount, category };
    editIndex = -1;
    form.querySelector('button[type="submit"]').textContent = 'Add';
  }

  updateTable();
  updateSummary();
  form.reset();
});

function updateTable() {
  fixedBody.innerHTML = '';
  variableBody.innerHTML = '';

  transactions.forEach((t, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.description}</td>
      <td style="color:${t.amount >= 0 ? 'green' : 'red'}">$${Math.abs(t.amount).toFixed(2)}</td>
      <td>${t.category}</td>
      <td>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </td>
    `;

    if (isFixedExpense(t)) {
      fixedBody.appendChild(row);
    } else if (t.amount < 0) {
      variableBody.appendChild(row);
    }
  });

  localStorage.setItem('budgetTransactions', JSON.stringify(transactions));
  addEditDeleteListeners();
}

function updateSummary() {
  const income = transactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const net = income + expenses;

  totalIncomeDisplay.textContent = income.toFixed(2);
  totalExpenseDisplay.textContent = Math.abs(expenses).toFixed(2);
  netSavingsDisplay.textContent = net.toFixed(2);
}

function addEditDeleteListeners() {
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.dataset.index;
      transactions.splice(idx, 1);
      updateTable();
      updateSummary();
      resetForm();
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
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

function resetForm() {
  editIndex = -1;
  form.querySelector('button[type="submit"]').textContent = 'Add';
  form.reset();
}

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('budgetTransactions');
  if (saved) {
    transactions = JSON.parse(saved);
    updateTable();
    updateSummary();
  }
});

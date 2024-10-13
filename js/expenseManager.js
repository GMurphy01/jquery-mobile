const dbManager = new IndexedDBManager("expenseDB", "expenses");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await dbManager.init();
    await refreshExpenseList();
  } catch (error) {
    console.error("Failed to load expenses:", error);
  }

  document
    .getElementById("addExpenseForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const dateInput = document.getElementById("date");
      const categoryInput = document.getElementById("category");
      const amountInput = document.getElementById("amount");
      const notesInput = document.getElementById("notes");

      const date = dateInput.value.trim();
      const category = categoryInput.value.trim();
      const amount = amountInput.value.trim();
      const notes = notesInput.value.trim();

      if (date && category && amount) {
        await addExpense(date, category, amount, notes);
        // Reset form fields after adding expense
        dateInput.value = "";
        categoryInput.value = "";
        amountInput.value = "";
        notesInput.value = "";

        window.location.href = "index.html";
      }
    });
});

async function addExpense(date, category, amount, notes) {
  try {
    await dbManager.add({ date, category, amount, notes });
    refreshExpenseList();
    showSuccessMessage("Expense added successfully.");
  } catch (error) {
    console.error("Failed to add expense:", error);
    showErrorMessage("Failed to add expense: ", error);
  }
}

async function refreshExpenseList() {
  try {
    const expenses = await dbManager.getAll();
    renderExpenses(expenses);
  } catch (error) {
    console.error("Failed to refresh expense list:", error);
  }
}

function renderExpenses(expenses) {
  const tableBody = document.querySelector("#expenseTable tbody");
  tableBody.innerHTML = ""; // Clear previous data

  expenses.forEach((expense) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.date}</td>
      <td>${expense.category}</td>
      <td>${expense.amount}</td>
      <td>${expense.notes}</td>
      <td><button onclick="deleteExpense(${expense.id})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

async function deleteExpense(expenseId) {
  try {
    await dbManager.delete(expenseId);
    refreshExpenseList();
    showSuccessMessage("Expense deleted successfully.");
  } catch (error) {
    console.error("Failed to delete expense:", error);
    showErrorMessage("Failed to delete expense: ", error);
  }
}

function showSuccessMessage(message) {
  // Remove any existing alerts
  const existingAlert = document.querySelector(".alert");
  if (existingAlert) {
    existingAlert.remove();
  }
  // Make an alert with the alert success class.
  const alert = document.createElement("div");
  alert.textContent = message;
  alert.className = "alert success";
  document.body.appendChild(alert);
}

function showErrorMessage(message) {
  // Remove any existing alerts
  const existingAlert = document.querySelector(".alert");
  if (existingAlert) {
    existingAlert.remove();
  }
  // Make an alert with alert error class.
  const alert = document.createElement("div");
  alert.textContent = message;
  alert.className = "alert error";
  document.body.appendChild(alert);
}

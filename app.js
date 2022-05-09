let transactionId = 0;
let incomeTotal;
let expenseTotal;
let totalBudget;
let totalBudgetMinus;
let newIncomeAmount;
let newExpenseAmount;
let totalPercentage;
let percentageTotal = document.getElementById("budget__expenses--percentage");
let percentage = document.getElementById("item__percentage");
let budgetMonth = document.getElementById("budget__title--month");
let budgetTotal = document.getElementById("budget__value");
let totalIncome = document.getElementById("budget__income--value");
let totalExpense = document.getElementById("budget__expenses--value");
const buttonEl = document.getElementById("add__btn");
const formEl = document.getElementById("add__container");
const inputDescription = document.getElementById("add__description");
const inputValue = document.getElementById("add__value");
const incomeEl = document.getElementById("income__list");
const expenseEl = document.getElementById("expenses__list");
let budgetDate = new Date();
budgetMonth.innerHTML = budgetDate.toLocaleDateString("en-CA", {
  month: "long",
  year: "numeric",
});
let listDate = new Date();
let listDates = listDate.toLocaleDateString("en-CA", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

class Transaction {
  constructor(description, amount) {
    this.description = description;
    this.amount = amount;
    this.date = listDates;
    this.id = transactionId++;
  }
}

class TransactionList {
  constructor() {
    this.incomeList = [];
    this.expenseList = [];
  }

  addNewTransaction(description, amount) {
    if (amount > 0) {
      this.incomeList.push(new Transaction(description, amount, listDates));
      incomeTotal = +totalIncome.innerHTML;
      incomeTotal += +amount;
      totalIncome.innerHTML = incomeTotal.toFixed(2);
    } else if (amount < 0) {
      this.expenseList.push(new Transaction(description, amount, listDates));
      expenseTotal = +totalExpense.innerHTML;
      expenseTotal += +amount * -1;
      totalExpense.innerHTML = expenseTotal.toFixed(2);
    }
    this.render();
    this.availableBudget();
  }

  removeIncomeTransaction(id) {
    var newIncome = this.incomeList.find((income) => income.id === +id);
    this.incomeList = this.incomeList.filter((income) => income.id !== +id);
    incomeTotal -= newIncome.amount;
    totalIncome.innerHTML = incomeTotal.toFixed(2);
    this.render();
    this.availableBudget();
  }
  
  removeExpenseTransaction(id) {
    var newExpense = this.expenseList.find((expense) => expense.id === +id);
    this.expenseList = this.expenseList.filter((expense) => expense.id !== +id);
    expenseTotal += +(newExpense.amount);
    totalExpense.innerHTML = expenseTotal.toFixed(2);
    this.render();
    this.availableBudget();
  }

  availableBudget() {
    totalBudget = incomeTotal - expenseTotal;
    if (totalBudget > 0) {
      budgetTotal.innerHTML = `+ $${totalBudget.toFixed(2)}`;
    } else if (totalBudget < 0) {
      totalBudgetMinus = totalBudget * -1;
      budgetTotal.innerHTML = `- $${totalBudgetMinus.toFixed(2)}`;
    } else if (incomeTotal === undefined) {
      budgetTotal.innerHTML = `- $${expenseTotal.toFixed(2)}`;
    } else if (expenseTotal === undefined) {
      budgetTotal.innerHTML = `+ $${incomeTotal.toFixed(2)}`;
    }
  }

  render() {
    incomeEl.innerHTML = "";
    this.incomeList.forEach((income) => {
      newIncomeAmount = +income.amount;
      incomeEl.insertAdjacentHTML(
        "beforeend",
        `<article class="item" data-id="${income.id}">
        <div class="item__description">${income.description}</div>
        <div class="right">
        <div class="item__value">+ $${newIncomeAmount.toFixed(2)}</div>
        <div class="item__delete">
          <button class="item__delete--btn">
            <i class="ion-ios-close-outline"></i>
          </button>
        </div>
        </div>
        <div class="item__date">${income.date}</div>
        </article>`
      );
    });

    expenseEl.innerHTML = "";
    this.expenseList.forEach((expense) => {
      newExpenseAmount = +expense.amount * -1;
      percentage = Math.round((newExpenseAmount / incomeTotal) * -100);
      totalPercentage = Math.round((expenseTotal / incomeTotal) * -100);
      percentageTotal.innerHTML = `${totalPercentage}%`;
      expenseEl.insertAdjacentHTML(
        "beforeend",
        `<article class="item" data-id="${expense.id}">
          <div class="item__description">${expense.description}</div>
          <div class="right">
          <div class="item__value">- $${newExpenseAmount.toFixed(2)}</div>
          <div class="item__percentage" id ="item__percentage">${percentage}%</div>
          <div class="item__delete">
          <button class="item__delete--btn">
            <i class="ion-ios-close-outline"></i>
          </button>
        </div>
        </div>
        <div class="item__date">${expense.date}</div>
        </article>`
      );
    });
  }
}

function handleAddNewTransaction(e) {
  e.preventDefault();
  if (inputDescription.value !== "" && inputValue.value !== "") {
    myTransactionList.addNewTransaction(
      inputDescription.value,
      inputValue.value,
      12
    );
    inputDescription.value = "";
    inputValue.value = "";
  }
}

function deleteIncomeTransactions(e) {
  const el = e.target;
  if (el.classList.contains("ion-ios-close-outline")) {
    myTransactionList.removeIncomeTransaction(el.closest("article").dataset.id);
  }
}

function deleteExpenseTransactions(e) {
  const el = e.target;
  if (el.classList.contains("ion-ios-close-outline")) {
    myTransactionList.removeExpenseTransaction(el.closest("article").dataset.id);
  }
}

const myTransactionList = new TransactionList();
buttonEl.addEventListener("click", handleAddNewTransaction);
incomeEl.addEventListener("click", deleteIncomeTransactions);
expenseEl.addEventListener("click", deleteExpenseTransactions);

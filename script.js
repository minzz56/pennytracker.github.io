var state = {
	 target: 0,
	pennysaved: 400,
	balance: 100,
	income: 100,
	expense: 100,
	transactions: [],
};

// var targetEl = document.querySelector("#target");
var dateEl = document.querySelector("#date");
var pennysavedEl = document.querySelector("#pennysaved");
var balanceEl = document.querySelector("#balance");
var incomeEl = document.querySelector("#income");
var expenseEl = document.querySelector("#expense");
var transactionsEl = document.querySelector("#transaction");
var incomeBtnEl = document.querySelector("#incomeBtn");
var expenseBtnEl = document.querySelector("#expenseBtn");
var nameInputEl = document.querySelector("#name");
var amountInputEl = document.querySelector("#amount");
//var submitEl=document.querySelector("#submit");

function init() {
	console.log("hello");
	var localState = JSON.parse(localStorage.getItem("expenseTrackerState"));

	if (localState !== null) {
		state = localState;
	}
	updateState();
	initListeners();
}

function uniqueId() {
	return Math.round(Math.random() * 10000);
}

function initListeners() {
	incomeBtnEl.addEventListener("click", onAddIncomeClick);
	expenseBtnEl.addEventListener("click", onAddExpenseClick);
	//submitEl.addEventListener("click",showTarget);
	
}

// adding income and expense
function onAddIncomeClick() {
	addTransaction(
		nameInputEl.value,
		amountInputEl.value,
		dateEl.value,
		"income"
	);
}

function onAddExpenseClick() {
	addTransaction(
		nameInputEl.value,
		amountInputEl.value,
		dateEl.value,
		"expense"
	);
}

 function showTarget(){
    var x = document.getElementById("submit").value;
	document.getElementById(
              "demo").innerHTML = x; }

// adding transaction
function addTransaction(name, amount, date, type) {
	if (name !== "" && amount !== "") {
		var transaction = {
			id: uniqueId(),
			name: name,
			amount: parseInt(amount),
			type: type,
			date: date,
		};

		state.transactions.push(transaction);
		updateState();
	} else {
		alert("please enter the name and amount");
	}

	nameInputEl.value = "";
	amountInputEl.value = "";
}

// deleting transaction
function onDeleteClick(event) {
	var id = parseInt(event.target.getAttribute("data-id"));
	var deleteIndex;
	for (var i = 0; i < state.transactions.length; i++) {
		if (state.transactions[i].id === id) {
			deleteIndex = i;
			break;
		}
	}
	state.transactions.splice(deleteIndex, 1);

	updateState();
}

function updateState() {
	var balance = 0,
		income = 0,
		expense = 0,
		// pennysaved = 0,
		item;

	for (var i = 0; i < state.transactions.length; i++) {
		item = state.transactions[i];

		if (item.type === "income") {
			income += item.amount;
		} else if (item.type === "expense") {
			expense += item.amount;
		}
	}

	balance = income - expense;
	// pennysaved = balance + pennysaved;

	state.balance = balance;
	state.income = income;
	state.expense = expense;
	// state.pennysaved = pennysaved;

	localStorage.setItem("expenseTrackerState", JSON.stringify(state));

	render();
}

function render() {
	// targetEl.innerHTML = `$${state.target}`;
	pennysavedEl.innerHTML = `$${state.pennysaved}`;
	balanceEl.innerHTML = `$${state.balance}`;
	incomeEl.innerHTML = `$${state.income}`;
	expenseEl.innerHTML = `$${state.expense}`;

	var transactionEl, containerEl, amountEl, item, btnEl, dEl;

	transactionsEl.innerHTML = "";

	for (var i = 0; i < state.transactions.length; i++) {
		item = state.transactions[i];
		transactionEl = document.createElement("li");
		transactionEl.append(item.name);
		transactionsEl.appendChild(transactionEl);

		containerEl = document.createElement("div");
		amountEl = document.createElement("span");
		if (item.type == "income") {
			amountEl.classList.add("income-amt");
		} else if (item.type == "expense") {
			amountEl.classList.add("expense-amt");
		}
		amountEl.innerHTML = `$${item.amount}`;

		containerEl.appendChild(amountEl);

		btnEl = document.createElement("button");
		btnEl.setAttribute("data-id", item.id);
		btnEl.innerHTML = "X";

		btnEl.addEventListener("click", onDeleteClick);

		containerEl.appendChild(btnEl);

		transactionEl.appendChild(containerEl);

		// date------------
		dEl = document.createElement("span");
		dEl.append(item.date);
		containerEl.appendChild(dEl);
		//--------------
	}
}

init();
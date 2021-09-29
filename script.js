var state = {
	// target: 1000,
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

function showtarget() {
	var x = document.getElementById("submit").value;
	document.getElementById(
              "demo").innerHTML = x;
}

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

		//  let d = new Date(date);
		//  let date_ = d.getDate();
		//  let month = d.getMonth();
		// let year = d.getFullYear();
		//  console.log(date_);

	    //  console.log(dateCheck(date));

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

// to check if date is changed or not
function isNewDay(date_string) {
	const cur_date = new Date();
	const date = new Date(date_string);
	const diff =
		cur_date.getFullYear() -
		date.getFullYear() +
		cur_date.getMonth() -
		date.getMonth() +
		cur_date.getDate() -
		date.getDate();
	if (diff !== 0) {
		return true;
	}
	return false;
}

// to update penny saved.
function calculatePenny(transactions) {
	let pennysaved = 0;
	for (let i of transactions) {
		if (isNewDay(i.date)) {
			if (i.type === "income") {
				pennysaved += i.amount;
			} else if (i.type === "expense") {
				pennysaved -= i.amount;
			}
		}
	}
	return pennysaved;
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

	state.balance = balance;
	state.income = income;
	state.expense = expense;
	state.pennysaved = calculatePenny(state.transactions);

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
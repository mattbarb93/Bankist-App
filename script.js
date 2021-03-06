'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; //Making the whole HTML empty

  //Sorting functionality.
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcPrintBalance = function (account) {
  account.balance = account.movements.reduce(function (acc, move) {
    return acc + move;
  }, 0);
  labelBalance.textContent = `${account.balance} EUR`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(move => move > 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumIn.textContent = `$${incomes}`;

  const outcomes = account.movements
    .filter(move => move < 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumOut.textContent = `$${Math.abs(outcomes)}`;

  const interest = account.movements
    .filter(move => move > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `$${Math.abs(interest)}`;
};

//Creates usernames for every single user in the users array
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    //Gets user's name, transforms into an username made of the first letter of the user's name combined.
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => {
        return name[0];
      })
      .join('');
  });
};

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display balance
  calcPrintBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

createUsernames(accounts);
console.log(accounts);

//Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //Prevent form from submitting

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('LOGIN');
    //Display UI and Message

    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //Field loses focus

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  //Store the amount that will be transfered in a variable
  const amount = Number(inputTransferAmount.value);
  //Looking for the account that will get the money
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAccount);
  //Clean the input fields after submitting
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    //Doing the transfer
    console.log('Transfer valid');
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//LOAN FUNCTIONALITY
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Add movement
    currentAccount.movements.push(amount);
  }

  //Update UI
  updateUI(currentAccount);

  inputLoanAmount.value = '';
});

//FIND INDEX METHOD

//Use splice to delete something, but first we need to use find index to delete
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    //DELETE ACCOUNT
    accounts.splice(index, 1);

    //HIDE UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputLoginPin.blur(); //Field loses focus
});

// //SOME AND EVERY METHODS

// //INCLUDES: Returns true or false to see whether the value exists or not. Only checks for equality

// console.log(movements);
// console.log(movements.includes(-130));

// //SOME: You can specify a condition. Basically more powerful than includes, but less simple

// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

// // EVERY

// //Only returns true if every element passes the test in the callback function, only then the EVERY returns true

// console.log(movements.every(mov => mov > 0)); //False
// console.log(account4.movements.every(mov => mov > 0)); //True

// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));

// //FLAT: Removes nested arrays and makes one single array. Only goes one level deep. If you add a parameter to the method call, it goes deeper

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, 5, 6], 7, 8];
// console.log(arrDeep.flat()); //Will return [Array(2), 3, 4, 5, 6, 7, 8]
// console.log(arrDeep.flat(2)); //Will return [1,2, 3, 4, 5, 6, 7, 8]

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);

// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, move) => acc + move, 0);
// console.log(overallBalance);

// //FLAPMAP Method: Combines a flat and a map method, better for performance
// //Flatmap only goes one level deep tho, keep it in mind.

// const overallBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, move) => acc + move, 0);
// console.log(overallBalance);
// /////////////////////////////////////////////////

// //SORTING ARRAYS

// //Strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// //Numbers
// console.log(movements);
// // console.log(movements.sort()); //Sorted alphabetically. Doesnt work

// // return < 0, A, B //Switch the order
// // return > 0, B, A //Keep order

// //ASCENDING ORDER
// // movements.sort((a, b) => {
// //   if (a > b) return 1;
// //   if (b > a) return -1;
// // });
// // console.log(movements);
// movements.sort((a, b) => a - b);
// console.log(movements);

// //DESCENDING ORDER
// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (b > a) return 1;
// // });
// movements.sort((a, b) => b - a);
// console.log(movements);

const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7); //Empty array with 7 blanks
console.log(x);

console.log(x.map(() => 5)); //Nothing comes up

//FILL METHOD: Fills the whole array with one value
x.fill(1, 3); //Starting at index 3, every element will be "1"
console.log(x);

arr.fill(23, 4, 6); //Starting at position 4, and ending at position 6, all elements will be equal to "23"
console.log(arr);

//ARRAY.FROM FUNCTION

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (cur, i) => i + 1); //Will return 1 to 7
console.log(z);

//Create an array that generates 100 Random Dice Rolls
const diceRolls = Array.from(
  { length: 100 },
  () => Math.round(Math.random() * 5) + 1
);
console.log(diceRolls);

//Use array.from to create an array from the result of querySelectorAll
//Include mapping function to convert the initial array to replace the $ sign with nothing, and then make it into numbers
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('$', ''))
  );

  console.log(movementsUI);
});

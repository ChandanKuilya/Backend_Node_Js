// Importing the Node.js fs module, which provides functions for working with the file system.
const fs = require('fs');

// Now We will read the contents of the i-input.json(i=1,2...etc) file synchronously, 
// then parse it as a JSON object,
// and store it in the data variable. 
//The outputFile variable stores the name of the output JSON file.

const data = JSON.parse(fs.readFileSync('1-input.json', 'utf8'));
// const data = JSON.parse(fs.readFileSync('2-input.json', 'utf8'));
const outputFile = '1-output.json';
// const outputFile = '2-output.json';


//Next we initialize an empty object balance to store the balance sheet data.

let balance = {};

// Now we iterate over the revenue data items and updates the balance object. 
//If a revenue item's startDate already exists in the balance object--
//-->the corresponding balance is increased by the revenue amount. 
//***Otherwise, a new entry is created with the revenue amount.

data['revenueData'].forEach((item) => {
  if (item.startDate in balance) {
    balance[item.startDate] += item.amount;
  } else {
    balance[item.startDate] = item.amount;
  }
});

//Similarly, we iterate over the expense data items and updates the balance object.
// If an expense item's startDate already exists in the balance object, the corresponding balance is decreased by the expense amount. 
//Otherwise, a new entry is created with the negative expense amount.

data['expenseData'].forEach((item) => {
  if (item.startDate in balance) {
    balance[item.startDate] -= item.amount;
  } else {
    balance[item.startDate] = -1 * item.amount;
  }
});


//Now we extract the unique dates from the balance object keys,--
//-- sort them in ascending order, and store the start and end dates.

let arrOfDates = Object.keys(balance)
arrOfDates.sort()
const start = arrOfDates[0];
const end = arrOfDates[arrOfDates.length - 1]


//Next we initialize an empty array yrs to store the years and creates an array months--
//-->containing the two-digit month representations.
let yrs = []
const months = ['01','02','03','04','05','06','07','08','09','10','11','12']

//Now we iterate over the years between the start and end dates 
//and adds them as strings to the yrs array.
for (
  let year = new Date(start).getFullYear();
  year <= new Date(end).getFullYear();
  year++
) {
  yrs.push(year.toString());
}

// In the next step with the help of  nested loops we iterate over the years and months to generate new dates. 
//If a new date falls within the range of start and end dates and does not exist in the arrOfDates array,--
 //--then, a new entry is added to the balance object with the date and a balance of 0.

for (let i in yrs)
  for (let j in months) {
    const newDate =yrs[i] +'-' +months[j]+arrOfDates[0].substring(7, arrOfDates[0].length).toString();

    if (newDate > start && newDate < end) {
      if (arrOfDates.indexOf(newDate) === -1) {
        balance[newDate] = 0;
        arrOfDates.push(newDate);
      }
    }
  }



// Sort the arrOfDates array in ascending order.
arrOfDates.sort();

//Initializing an output object with an empty balance array.

let output = {
  balance: [],
};


// Finally we iterate over the arrOfDates array, creates objects containing the balance amount and start date for each date, 
//and pushes them into the output.balance array.


arrOfDates.forEach((item) => {
  const obj = {};
  obj['amount'] = balance[item];
  output.balance.push(obj);
});


//As a final step we write the output object as a formatted JSON string to the output.json file.
fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));

console.log('Output file generated successfully.');


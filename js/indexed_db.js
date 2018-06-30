/**
* Author: Adeniran Mark Oluwafemi
* Version: 1.0.0
* Title: CurrencyCX
* Discription: To convert between currencies globally
**/

if (!window.indexedDB) {
    console.log("Please update browser to latest version to enjoy this app to the fullest");
}

// openning database
function openDatabase(){
	const DB_NAME 	= 'CurrencyCX';
	const database 	= indexedDB.open(DB_NAME, 1);
	database.onerror = (event) => {
		console.log('error opening web database');
		return false;
	};

	database.onupgradeneeded = function(event) {
		  	let upgradeDB = event.target.result;
	  	  let objectStore = upgradeDB.createObjectStore("currencies");
	};

	// return db instance
	return database;
}

// save currencies to
function saveToDatabase(data){
	const db = openDatabase();
	db.onsuccess = (event) => {
		const query = event.target.result;
		const currency = query.transaction("currencies").objectStore("currencies").get(data.symbol);
	  	currency.onsuccess = (event) => {
	  		const dbData = event.target.result;
	  		const store  = query.transaction("currencies", "readwrite").objectStore("currencies");

	  		if(!dbData){
				store.add(data, data.symbol);
	  		}else{
	  			store.put(data, data.symbol);
	  		};
	  	}
	}
}

// fetch from web database
function fetchFromDatabase(symbol, amount) {
	// init database
	const db = openDatabase();

	// on success add user
	db.onsuccess = (event) => {
	const query = event.target.result;

		// check if already exist symbol
		const currency = query.transaction("currencies").objectStore("currencies").get(symbol);
      currency.onsuccess = (event) => {
	  		const data = event.target.result;

			let pairs = symbol.split('_');
			let fr = pairs[0];
			let to = pairs[1];
if (currency.onsuccess) {
  $(".results").append(`
    <div>
              <h1 class="small text-center"> <b>${amount}</b> <b>${fr}</b> & <b>${to}</b> converted successfully !</h1>
      <hr />
      Exchange rate for <b>${amount}</b> <b>${fr}</b> to <b>${to}</b> is: <br />
      <b>${numeral(amount * data.value).format('0.000')}</b>
    </div>
  `);
} else {
  console.log('You need internet access to add this currency pair');
  
}

	  	}
	}
}

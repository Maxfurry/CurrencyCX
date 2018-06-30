/**
* Author: Adeniran Mark Oluwafemi
* Version: 1.0.0
* Title: CurrencyCX
* Discription: To convert between currencies globally
**/

if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB");
}

// open database
function openDatabase(){
	// return db instances
	const DB_NAME 	= 'CurrencyCX';
	const database 	= indexedDB.open(DB_NAME, 1);

	// on error catch errors
	database.onerror = (event) => {
		console.log('error opening web database');
		return false;
	};

	// check db version
	database.onupgradeneeded = function(event) {
	  	// listen for the event response
	  	var upgradeDB = event.target.result;

	  	// create an objectStore for this database
	  	var objectStore = upgradeDB.createObjectStore("currencies");
	};

	// return db instance
	return database;
}

// save to currencies object
function saveToDatabase(data){
	// init database
	const db = openDatabase();

	// on success add user
	db.onsuccess = (event) => {

		// console.log('database has been openned !');
		const query = event.target.result;

	  	// check if already exist symbol
		const currency = query.transaction("currencies").objectStore("currencies").get(data.symbol);

		// wait for users to arrive
	  	currency.onsuccess = (event) => {
	  		const dbData = event.target.result;
	  		const store  = query.transaction("currencies", "readwrite").objectStore("currencies");

	  		if(!dbData){
	  			// save data into currency object
				store.add(data, data.symbol);
	  		}else{
	  			// update data existing currency object
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

		// console.log('database has been openned !');
		const query = event.target.result;

		// check if already exist symbol
		const currency = query.transaction("currencies").objectStore("currencies").get(symbol);

		// wait for users to arrive
	  	currency.onsuccess = (event) => {
	  		const data = event.target.result;

			let pairs = symbol.split('_');
			let fr = pairs[0];
			let to = pairs[1];

			$(".results").append(`
				<div class="card-feel">
	                <h1 class="small text-center"> <b>${amount}</b> <b>${fr}</b> & <b>${to}</b> converted successfully !</h1>
					<hr />
					Exchange rate for <b>${amount}</b> <b>${fr}</b> to <b>${to}</b> is: <br />
					<b>${numeral(amount * data.value).format('0.000')}</b>
				</div>
			`);
	  	}
	}
}

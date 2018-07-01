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

// fetch from database
function fetchFromDatabase(symbol, amount) {
	const db = openDatabase();

	db.onsuccess = (event) => {
	const query = event.target.result;

		// check if symbol exist
		const currency = query.transaction("currencies").objectStore("currencies").get(symbol);
      currency.onsuccess = (event) => {
	  		const data = event.target.result;

        if(data == nul){
	  			$(".message").append(`
					<div class="text-danger">
		                	You have not converted this pairs before <br /> Please connect to the internet once so as to convert
					</div>
				`);

				// Remove message
				setTimeout((err) => {
					$(".message").html("");
				}, 1000 * 9);
				return;
	  		}

			let pairs = symbol.split('_');
			let fr = pairs[0];
			let to = pairs[1];

			$(".results").append(`
				<div>
	                <h1 class="small text-center"> <b>${amount}</b> <b>${fr}</b> & <b>${to}</b> converted successfully !</h1>
					<hr />
					Exchange rate for <b>${amount}</b> <b>${fr}</b> to <b>${to}</b> is: <br />
					<b>${numeral(amount * data.value).format('0.000')}</b>
				</div>
			`);
	  	}
	}
}

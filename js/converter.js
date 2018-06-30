/**
* Author: Adeniran Mark Oluwafemi
* Version: 1.0.0
* Title: CurrencyCX
* Discription: To convert between currencies globally
**/
'use strict';

// Currencies conversion
function convertCurrency(){
	let conv_fr 	= $("#option4rm").val();
	let conv_to 		= $("#option2").val();
	let amount	= $("#UserInput").val();

	// build query
	let conv  = conv_fr+"_"+conv_to;
	let query = {
		q: conv
	};

	$.get('https://free.currencyconverterapi.com/api/v5/convert', query, (data) => {
		// convert to array
		const convrtns = Array.from(obj2arrays(data.results));

		$.each(convrtns, function(index, ans) {
			$(".convertedAmount").append(`
				<div>
					converted successfully <br />
					${amount} ${ans.fr} =
					${parseFloat(Math.round(amount * ans.val) / 100).toFixed(5)}
					${ans.to}
				</div>
			`);
		});
	})
	return false;
}

function* obj2arrays(obj) {
    for (let prop of Object.keys(obj)) // own properties, you might use
                                       // for (let prop in obj)
        yield obj[prop];
}

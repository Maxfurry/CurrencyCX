var https = require('https');
var express = require('express');
var app = express();

// set up handlebars view engine
var handlebars = require('express-handlebars')
.create();
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// set up server port
app.set('port', process.env.PORT || 3000);

// serve static files
app.use('/public', express.static('public'));

// homepage
app.get('/', function(req, res){
  var amount = req.query['userInput'];
  var fromCurrency = req.query['selectOption4'];
  var toCurrency = req.query['selectOption2'];
  convertCurrency(amount, fromCurrency, toCurrency, function(err, amount) {
    console.log(amount);
    var inmt = req.query['userInput'];
    var rate = (amount/inmt).toFixed(2);
  res.render('index', {amount: amount, rate: rate});
  });
});

function convertCurrency(amount, fromCurrency, toCurrency, cb) {
  var apiKey = ' ';
  fromCurrency = encodeURIComponent(fromCurrency);
  toCurrency = encodeURIComponent(toCurrency);
  var query = fromCurrency + '_' + toCurrency;

  var url = 'https://free.currencyconverterapi.com/api/v5/convert?q='
            + query + '&compact=ultra&apiKey=' + apiKey;

  https.get(url, function(res){
      var body = '';

      res.on('data', function(chunk){
          body += chunk;
      });

      res.on('end', function(){
          try {
            var jsonObj = JSON.parse(body);

            var val = jsonObj[query];
            if (val) {
              var total = val * amount;
              cb(null, Math.round(total * 100) / 100);
            } else {
              var err = new Error("Value not found for " + query);
              console.log(err);
              cb(err);
            }
          } catch(e) {
            console.log("Parse error: ", e);
            cb(e);
          }
      });
  }).on('error', function(e){
        console.log("Got an error: ", e);
        cb(e);
  });
}

// start server
app.listen(app.get('port'), function(){
console.log( 'Express started on http://localhost:' +
app.get('port') + '; press Ctrl-C to terminate.' );
});

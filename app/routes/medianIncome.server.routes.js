'use strict';

var fs = require('fs');

module.exports = function(app) {
  // Route /zip/:code returns the median income for the specified zipcode
  var medianIncomes;
  app.get('/medianIncome', function(req, res) {
    var zipcodes = req.query.zipcodes;
    var rangeInc = req.query.rangeInc;
    var incomeArr = [];
    // if medianIncomes isn't defined, parse the census data and assign to variable
    if(!medianIncomes) {
      medianIncomes = JSON.parse(fs.readFileSync('./app/data/censusdata.json'));
    }
    zipcodes.forEach(function(zipcode){
      if(Number(rangeInc[0]) <= Number(medianIncomes[zipcode]) && Number(medianIncomes[zipcode]) <= (rangeInc[1])) {
        incomeArr.push({zipcode: zipcode, medianIncome: medianIncomes[zipcode]});
      } 
    });

    res.send(incomeArr);
  });
};
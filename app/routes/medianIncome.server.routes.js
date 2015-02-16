'use strict';

var fs = require('fs');

module.exports = function(app) {
  // Route /medianincome returns an object with the median income and the zipcode
  var medianIncomes;
  app.get('/medianIncome', function(req, res) {
    console.log("A");
    var zipcodes = req.query.zipcodes;
    var rangeInc = req.query.rangeInc;
    var incomeArr = [];
    var filter = function() {
      zipcodes.forEach(function(zipcode){
        if(Number(rangeInc[0]) <= Number(medianIncomes[zipcode]) && Number(medianIncomes[zipcode]) <= Number(rangeInc[1])) {
          incomeArr.push({zipcode: zipcode, medianIncome: medianIncomes[zipcode]});
        } 
      });
      res.send(incomeArr);
    };
    // if medianIncomes isn't defined, parse the census data and assign to variable
    if(!medianIncomes) {
      fs.readFile('./app/data/censusdata.json', function(err, data) {
        if(err) { return err; }
        medianIncomes = JSON.parse(data);
        filter();
      });
    } else {
      filter();
    }
    
    console.log('B');
    zipcodes.forEach(function(zipcode){
      if(Number(rangeInc[0]) <= Number(medianIncomes[zipcode]) && Number(medianIncomes[zipcode]) <= (rangeInc[1])) {
        incomeArr.push({zipcode: zipcode, medianIncome: medianIncomes[zipcode]});
      } 
    });

    res.send(incomeArr);
  });
};
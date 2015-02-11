'use strict';

var fs = require('fs');

module.exports = function(app) {
  // Route /zip/:code returns the median income for the specified zipcode
  var allZips;
  app.get('/zip/:code', function(req, res) {
    var zip = req.params.code;

    // if allZips isn't defined, parse the census data and assign to variable
    if(!allZips) {
      fs.readFile('./app/data/censusdata.json', function(err, data) {
        if(err) { return console.log(err); }
        allZips = JSON.parse(data);
        res.send(allZips[zip]);
      });
    } else {
      res.send(allZips[zip]);
    }
  });
}
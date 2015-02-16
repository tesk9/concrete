'use strict';
var http = require('http');

module.exports = function(app) {
  app.get('/zipcodesof/:state/:city', function(req, res) {
    var city = req.params.city.split(' ').join('%20');
    var state = req.params.state;
    var apiUrl = 'http://www.zipcodeapi.com/rest/' + process.env.ZIPCODE_KEY + '/city-zips.json/' + city +'/' + state;

    http.get(apiUrl, function(response) {   
      var data = '';
      response.on('data', function(chunk) {
        data += chunk;
      });
      response.on('end', function() {
        res.send(data);
      });
    });
  });
};
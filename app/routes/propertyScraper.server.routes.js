'use strict';

module.exports = function(app) {
	var Scraper = require('../../app/controllers/API/propertyScraper.server.controller.js');
  var scraper = new Scraper();

  app.route('/scraper').get(scraper.cityFeet);
};
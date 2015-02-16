'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var _ = require('lodash');
var fs = require('fs');
var request = require('request');
var properties = require('./seed_property.js')();
var http = require('http');
var $ = require('jquery')(require('jsdom').jsdom().parentWindow);
var Browser = require('zombie');
var assert = require('assert');

module.exports = function(){
  this.cityFeet = function(req, res) {
    res.json(properties);
  };

  // Helper function for scraper
  var download = function(url, callback) {
    http.get(url, function(res) {
    var data = "";
    res.on("data", function(chunk) {
        data += chunk;
      });

      res.on("end", function() {
        callback(data);
      });
    }).on("error", function(e) {
      return console.log("Error: " + e.message);
    });
  };

  var scrape = function(zipcode, cb) {
    var browser = new Browser({debug: true});
    var url = "http://www.loopnet.com/xNet/MainSite/Listing/Search/SearchResults.aspx#/87114/Multiple-Types/For-Sale/c!ARUAAAEVExDglqo7g8LTHTF-AF$DABj_AQJgIAQAACw$AA";
    browser.visit(url, function() {
      // var now = new Date();
      setTimeout(function() {
        // var now2 = new Date();
        // console.log(now2.getTime() - now.getTime());
        console.log(browser.html('#searchResults'));
        browser.viewInBrowser();
      }, 50000);
    });
  };

  scrape(87114, function(result) {
    // console.log(result);
  });


};
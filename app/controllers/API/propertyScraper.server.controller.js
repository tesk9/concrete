'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var _ = require('lodash');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var properties = require('./seed_property.js')();

module.exports = function(){
  this.cityFeet = function(req, res) {
    res.json(properties);
  };
};
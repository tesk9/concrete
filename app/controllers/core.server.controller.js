'use strict';

var api_key = process.env.USA_TODAY_API_KEY || '',
    googleMapAPI = process.env.GOOGLE_MAPS_API || '';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
  res.render('index', {
		user: req.user || null,
		request: req
	});
};
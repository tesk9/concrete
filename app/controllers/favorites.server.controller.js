'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Favorite = mongoose.model('Favorite'),
	_ = require('lodash');

/**
 * Create a favorite
 */
exports.create = function(req, res) {
	var favorite = new Favorite(req.body);
	favorite.user = req.user;

	favorite.save(function(err) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(favorite);
		}
	});
};

/**
 * Delete a favorite
 */
exports.delete = function(req, res) {
	var favorite = req.favorite;

	favorite.remove(function(err) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(favorite);
		}
	});
};

/**
 * List of Favorites
 */
exports.list = function(req, res) {
	Favorite.find({user: req.user.id}).sort('-favorited').populate('user', 'displayName').exec(function(err, favorites) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(favorites);
		}
	});
};

/**
 * Favorite middleware
 */
exports.favoriteByID = function(req, res, next, id) {
	Favorite.findById(id).populate('user', 'displayName').exec(function(err, favorite) {
		if(err) return next(err);
		if(!favorite) return next(new Error('Failed to load favorite ' + id));
		req.favorite = favorite;
		next();
	});
};

/**
 * Favorite authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if(req.favorite.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
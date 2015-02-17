'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	favorites = require('../../app/controllers/favorites.server.controller');

module.exports = function(app) {
	// Favorite Routes
	app.route('/favorites')
		.get(users.requiresLogin, favorites.list)
		.post(users.requiresLogin, favorites.create);

	app.route('/favorites/:favoriteId')
		.delete(users.requiresLogin, favorites.hasAuthorization, favorites.delete);

	// Finish by binding the favorite middleware
	app.param('favoriteId', favorites.favoriteByID);
};
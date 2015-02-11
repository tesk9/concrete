'use strict';

// Load environmental variables
if(process.env.NODE_ENV === 'development') {
	require('./locals.js');
}

module.exports = {
	db: 'mongodb://localhost/concrete-dev',
	app: {
		title: 'concrete - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	}
};

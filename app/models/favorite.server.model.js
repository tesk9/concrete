'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// /**
//  * Favorite Schema
//  */
var FavoriteSchema = new Schema({
  favorited: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String,
    default: '',
    required: 'Address cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Favorite', FavoriteSchema);
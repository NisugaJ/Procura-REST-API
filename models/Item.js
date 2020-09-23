var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ITEM_CATEGORIES = require('../params').ITEM_CATEGORIES

var Item = new Schema({
  name: {
    type: String,
    required: true
  },
  supplierId: {
    type: String,
    required: true
  },
  wightPerItem: {
    type: Number, // in Kg
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category:{
    type: String,
    required: true,
    enum : Object.values(ITEM_CATEGORIES)
  }
});

module.exports = mongoose.model('Items', Item);
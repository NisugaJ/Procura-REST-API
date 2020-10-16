var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ITEM_CATEGORIES = require("../params").ITEM_CATEGORIES;

var Item = new Schema({
  itemName: {
    type: String,
    required: true,
  },
  supplierId: {
    type: String,
    required: true,
  },
  wightPerItem: {
    type: Number, // in Kg
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: Object.values(ITEM_CATEGORIES),
  },
  maxQty: {
    type: Number,
    required: true,
  },
  availableQty: {
    type: Number,
    required: true,
  },
  photoURL11: {
    type: String,
    required: true,
  },
  photoURL21: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Item", Item, "Items");

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SiteManagerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  siteId: {
    type: Number,
    required: true
  },
  workingHours: {
    type: String,
    required: true
  },
  nightShift: {
    type: Boolean,
    required: true
  },
  rank: {
    type: String,
    required: true
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SiteManagers', SiteManagerSchema);
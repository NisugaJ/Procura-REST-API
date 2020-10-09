var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Locations = new Schema({
  location: {
    type: String,
  },
});

module.exports = mongoose.model("Locations", Locations);

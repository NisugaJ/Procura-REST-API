var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Order = new Schema({
//   orderId: {
//     type: String,
//   },
});

module.exports = mongoose.model("Order", Order);

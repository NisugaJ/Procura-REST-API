var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var REQUISITION_STATUS = require("../params").REQUISITION_STATUS;

var Requisition = new Schema({
  userName: {
    type: String,
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
  supplierId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  requiredDate: {
    type: Date,
    required: true,
  },
  siteId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: REQUISITION_STATUS.APPROVAL_PENDING,
    enum: Object.values(REQUISITION_STATUS),
  },
});

module.exports = mongoose.model("Requisitions", Requisition);

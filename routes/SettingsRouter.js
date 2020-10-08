var express = require("express");
var router = express.Router();
var Supplier = require("../models/Settings");
const dbCon = require("../utils/db_Connection");

/* GET ALL Settings */
router.get("/", function (req, res, next) {
  var MongoClient = require("mongodb").MongoClient;
  var url = dbCon.mongoURIConnString;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ProcurementDB");
    dbo
      .collection("Settings")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
        db.close();
      });
  });
});

module.exports = router;

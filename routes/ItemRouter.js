var express = require("express");
var router = express.Router();
var Item = require("../models/Item");
const dbCon = require("../utils/db_Connection");

/* GET ALL Items */
router.get("/", function (req, res, next) {
  //
  var MongoClient = require("mongodb").MongoClient;
  var url = dbCon.mongoURIConnString;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ProcurementDB");
    dbo
      .collection("Items")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
        db.close();
      });
  });
});

/* GET SINGLE Item BY ID */
router.get("/:id", function (req, res, next) {
  Item.findById(req.params.id, function (err, item) {
    if (err) return next(err);
    res.json(requisition);
  });
});

/* POST - Register a Item */
router.post("/register", function (req, res, next) {
  Item.create(req.body, function (err, item) {
    if (err) return next(err);
    res.json(item);
  });
});

/* UPDATE Item */
router.put("/:id", function (req, res, next) {
  Item.findByIdAndUpdate(req.params.id, req.body, function (err, item) {
    if (err) return next(err);
    res.json(item);
  });
});

/* DELETE Item */
router.delete("/:id", function (req, res, next) {
  Item.findByIdAndRemove(req.params.id, req.body, function (err, item) {
    if (err) return next(err);
    res.json(item);
  });
});

module.exports = router;

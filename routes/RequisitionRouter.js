var express = require('express');
var router = express.Router();
const dbCon = require("../utils/db_Connection");
var Requisition = require('../models/Requisition');
const params = require('../params');
var ObjectId = require('mongodb').ObjectID;
router = express.Router();

/* GET ALL Requisitions */
router.get('/all', function(req, res, next) {

var MongoClient = require("mongodb").MongoClient;
var url = dbCon.mongoURIConnString;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ProcurementDB");
    dbo
      .collection("Requisitions")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
        db.close();
      });
  });



});

/* GET Requisitions BY Type */
router.get('/:type', function(req, res, next) {
    console.log("----");
    console.log(req.params.type);
    var stringArr = req.url.split('type=');
    var type  = stringArr[1]; 
 
    // APPROVAL_PENDING , APPROVED , REJECTED , IN_PROCESS , ORDER_PLACED , DELIVERED , PARTIALLY_DELIVERED 
    if(type == 'APPROVAL_PENDING' || type == 'APPROVED'||type == 'REJECTED' || type == 'IN_PROCESS' ){

        var MongoClient = require("mongodb").MongoClient;
        var url = dbCon.mongoURIConnString;



        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("ProcurementDB");
            dbo
              .collection("Requisitions")
              .find({  status:  type})
              .toArray(function (err, result) {
                if (err) throw err;
                // console.log(result);
                res.send(result);
                db.close();
              });
          });

    }

  });
    
// Get Requisition by requisionId
//Only handle APPROVAL_PENDING,  IN_PROCESS , APPROVED, REJECTED
router.get('/getById/:reqId', function(req, res, next) {
    console.log("----");
    console.log(req.params.type);
    var stringArr = req.url.split('reqId=');
    var reqId  = stringArr[1]; 

        var MongoClient = require("mongodb").MongoClient;
        var url = dbCon.mongoURIConnString;

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("ProcurementDB");
            dbo
              .collection("Requisitions")
              .find( ObjectId(reqId))
              .toArray(function (err, result) {
                if (err) throw err;
                // console.log(result);
                res.send(result);
                db.close();
              });
          });
  });




/* GET SINGLE Requisition BY ID */
router.get('/:id', function(req, res, next) {
  Requisition.findById(req.params.id, function (err, requisition) {
        if (err) return next(err);
        res.json(requisition);
    });
});
  
/* POST - Register a Requisition */
router.post('/register', function(req, res, next) {

    var MongoClient = require("mongodb").MongoClient;
    var url = dbCon.mongoURIConnString;

    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ProcurementDB");
    
    // current timestamp in milliseconds
let ts = Date.now();

let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();

// prints date & time in YYYY-MM-DD format
var today = date+"/"+month+"/"+year;

    var requisitionObj = {
        siteManagerUsername: req.body.loggedInUser,
        itemId : req.body.itemObjId,
        supplierId:req.body.supplierId,
        quantity:req.body.orderCount,
        requiredDate: req.body.selectedNeedDate,
        siteId: req.body.selectedSite,
        totalPrice: req.body.total,
        comment:req.body.comment,
        priority:req.body.priority,
        status :req.body.status,
        // requisitionDate:Date.now,
        requisitionDate:today,
        approvedDate:"",
        approvedBy:""
        };

    dbo.collection("Requisitions").insertOne(requisitionObj, function(err, res1) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });
    }); 

    res.send("true");
});
  
/* UPDATE Requisition */
router.put('/:id', function(req, res, next) {
   
//   Requisition.findByIdAndUpdate(req.params.id, req.body, function (err, requisition) {
//         if (err) return next(err);
//         res.json(requisition);
//     });
res.send(req.body);
});
  
/* DELETE Requisition */
router.delete('/:id', function(req, res, next) {
    console.log(req.params.id);

    var stringArr = req.url.split('id=');
    var reqId  = stringArr[1]; 

    var MongoClient = require("mongodb").MongoClient;
    var url = dbCon.mongoURIConnString;

      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ProcurementDB");
        var myquery = { _id: reqId };
        dbo.collection("Requisitions").deleteOne( {"_id": ObjectId(reqId)}, function(err, obj) {
          if (err) throw err;
          console.log("1 document deleted");
          res.send("true");
          db.close();
        });
      }); 

});

router.get('/daily/:status',  function(req, res, next) {
    Requisition.aggregate([
        {
            $match: { status: req.params.status }
        },
        {
            $group: { 
                _id: {
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d", 
                            date: "$updated"
                        }
                    }
                }, 
                count: {
                    $sum: 1
                }
            }
        },
        { $sort: {_id: 1} }
    ], function (err, siteManagers) {
        if (err) return next(err);
        res.json(siteManagers);
    });
});

module.exports = router;
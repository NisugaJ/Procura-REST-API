var express = require('express');
var router = express.Router();
const dbCon = require("../utils/db_Connection");
var Requisition = require('../models/Requisition');
const params = require('../params');
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

    

    // Requisition.findById(req.params.id, function (err, requisition) {
    //       if (err) return next(err);
    //       res.json(requisition);
    //   });


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
        requisitionDate:Date.now,
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
    console.log(req.params.id);
//   Requisition.findByIdAndUpdate(req.params.id, req.body, function (err, requisition) {
//         if (err) return next(err);
//         res.json(requisition);
//     });
res.send(req.body);
});
  
/* DELETE Requisition */
router.delete('/:id', function(req, res, next) {
  Requisition.findByIdAndRemove(req.params.id, req.body, function (err, requisition) {
        if (err) return next(err);
        res.json(requisition);
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
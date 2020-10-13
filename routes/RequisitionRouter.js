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

    console.log("444444433333")
    console.log(req.body);

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
        requisitionDate:today,
        approvedDate:"",
        approvedBy:""
        };

    dbo.collection("Requisitions").insertOne(requisitionObj, function(err, res1) {
        if (err) throw err;
        console.log("1 requisition inserted");
        // console.log(res1);

            //if the type order placed without approval 
            //add to orders collection
            //send mail

            if(req.body.status == 'ORDER_PLACED'){
                
                console.log("Placed type order");
                console.log(res1.ops[0]._id);
                console.log(req.body.supplierId);
                console.log(req.body.orderCount);

                var supplierMail = "";
                dbo.collection("Supplier").findOne({"_id": ObjectId(req.body.supplierId)}, function(err, result) {
                    if (err) throw err;
                    console.log(result.supplierMail);
                    //#
                    var supplierName = result.name;
                    //#
                    supplierMail = result.supplierMail;

                    var str = res1.ops[0]._id+'';
                    var split = str.split('"');

                    var orderObj = {
                        requisitionId: split[0],
                        status :'ORDER_PLACED',
                        orderedCount:req.body.orderCount,
                        receivedCount:0,
                        signature:"",
                        receivedDate:"",
                        totalPrice: req.body.total,
                        };

                    dbo.collection("Orders").insertOne(orderObj, function(err, res1) {
                        if (err) throw err;
                        console.log("1 order inserted");

                        dbo.collection("Items").findOne({"_id": ObjectId(req.body.itemObjId)}, function(err, res2) {
                            if (err) throw err;
                                var itemName = res2.itemName;

                                console.log("#########");
                                console.log(itemName);
                                console.log(supplierName);

                                var orderCount = req.body.orderCount;
                                var selectedNeedDate =req.body.selectedNeedDate;
                                var total = req.body.total;
                                var comment = req.body.comment;
                                
                                var priorityStr = "";
                                if(req.body.priority == 1){
                                    priorityStr= "Low";
                                }else if(req.body.priority == 2){
                                    priorityStr= "Medium";
                                }else if(req.body.priority == 3){
                                    priorityStr="High";
                                }

                                var priority =req.body.priority;

                                console.log(req.body.orderCount);
                                console.log( req.body.selectedNeedDate);
                                console.log(req.body.total);
                                console.log(req.body.comment);
                                console.log(req.body.priority);
                                console.log("#########");



                                //send mail
                                var nodemailer = require('nodemailer'); 
                                var transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                    user: 'procuracsseproject@gmail.com',
                                    pass: 'csseproject'
                                    }
                                });
                                
                                var mailOptions = {
                                    from: 'procuracsseproject@gmail.com',
                                    to: supplierMail,
                                    subject: 'Order request',
                                    html: '<p>Hi </p>'+{supplierName}+',<br/>'+'<p>We are glad to inform you that we need to purchse the following items from your company</p><br/>'+
                                    '<p>Item Name:</p>'+{itemName}+'<br/>'+
                                    '<p>Item Quantity:</p>'+{orderCount}+'<br/>'+
                                    '<p>Need On or before:</p>'+{selectedNeedDate}+'<br/>'+
                                    '<p>Expected Total Price:</p>'+{total}+'<br/>'+
                                    '<p>Item Quantity:</p>'+{orderCount}+'<br/>'+
                                    '<p>Priority:</p>'+{priorityStr}+'<br/>'+
                                    '<p>Comment:</p>'+{comment}+'<br/>'
                                    
                                };
                                
                                transporter.sendMail(mailOptions, function(error, info){
                                    if (error) {
                                    console.log(error);
                                    } else {
                                    console.log('Email sent: ' + info.response);
                                    }
                                }); 
                                //send mail end 
                                // console.log(res1);
                                res.send(res1);       
                                db.close();               
                        });
                        
                        // console.log(res1);
                        // res.send(res1);       
                        // db.close();               
                    });
                    // res.send(result);       
                    // db.close();    
                    //Insert order to orders collection - end
                });

                // mail
            }else{
                res.send(res1);
                db.close();
            }
        
    });
    }); 

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
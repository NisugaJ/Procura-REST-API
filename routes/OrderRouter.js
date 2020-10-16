var express = require("express");
var router = express.Router();
var Order = require("../models/Order");
var Requisition = require("../models/Requisition");
var Supplier = require("../models/Supplier");
var Item = require("../models/Item");
const dbCon = require("../utils/db_Connection");
var ObjectId = require('mongodb').ObjectID;


/* GET ALL Orders */
router.get('/all', async function(req, res, next) {
  let orders = [];
  try{
     orders = await Order
     .find()
     .populate(
       {
         path:'requisitionId', model: Requisition,
       })
      .populate(
      {
        path:'itemId', model: Item,
      })
    }catch(e){
      console.log("ERROR:",e);
      res.status(200).json({'success':false, 'error': e.message })
    }finally{
      if(orders){
        res.status(200).json({'success':true, orders:orders})
      }
    }
});
  
/* GET SINGLE Order BY ID */
router.get('/:id', function(req, res, next) {

    console.log(req.params.id);
    var stringArr = req.url.split('id=');
   var supplierObjId  = stringArr[1]; 

   var MongoClient = require("mongodb").MongoClient;
   var url = dbCon.mongoURIConnString;

   MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ProcurementDB");
    dbo
      .collection("Supplier")
      .find(ObjectId(supplierObjId))
      .toArray(function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
        db.close();
      });
  });

});


/* order received */
router.post("/received", function (req, response, next) {
  
    console.log("666");
    console.log(req.body);

         // current timestamp in milliseconds
         let ts = Date.now();

         let date_ob = new Date(ts);
         let date = date_ob.getDate();
         let month = date_ob.getMonth() + 1;
         let year = date_ob.getFullYear();
     
         // prints date & time in YYYY-MM-DD format
         var today = date+"/"+month+"/"+year;


    var reqObj = {
        fullDelivery : req.body.fullDelivery,
        inputCount : req.body.inputCount,
        orderId : req.body.orderId,
        proof : req.body.proof,
        quantity : req.body.quantity,
        reqId: req.body.reqId,
        date:today,
        totalPrice: req.body.totalPrice,
    }

    //update status of requisition colection
    //update orders
    // ##################
    var MongoClient = require("mongodb").MongoClient;
    var url = dbCon.mongoURIConnString;

    if(reqObj.fullDelivery){
        //full delivery start
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("ProcurementDB");
            var myquery = { "_id": ObjectId(reqObj.reqId) };
            var newvalues = { $set: {status: "DELIVERED" } };
            dbo.collection("Requisitions").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log("1 requisition updated");     
                             

              var myquery1 = { "_id": ObjectId(reqObj.orderId) };
              var newvalues1 = { $set: {
                  status: "DELIVERED", 
                  orderedCount:reqObj.quantity,
                  receivedCount : reqObj.inputCount,
                  signature : reqObj.proof,
                  receivedDate: reqObj.date,
                  totalPrice: reqObj.totalPrice
                } };
              dbo.collection("Orders").updateOne(myquery1, newvalues1, function(err, res) {
                if (err) throw err;
                console.log("1 order updated");     
                               
                response.send(true);
                db.close();
              });
                    // #
              db.close();
            });
          }); 
        //full delivery end
    }else {
        //partial delivery start
         //full delivery start
         MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("ProcurementDB");
            var myquery = { "_id": ObjectId(reqObj.reqId) };
            var newvalues = { $set: {status: "PARTIALLY_DELIVERED" } };
            dbo.collection("Requisitions").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log("1 requisition updated");     
                             

              var myquery1 = { "_id": ObjectId(reqObj.orderId) };
              var newvalues1 = { $set: {
                  status: "PARTIALLY_DELIVERED", 
                  orderedCount:reqObj.quantity,
                  receivedCount : reqObj.inputCount,
                  signature : reqObj.proof,
                  receivedDate: reqObj.date,
                  totalPrice: reqObj.totalPrice
                } };
              dbo.collection("Orders").updateOne(myquery1, newvalues1, function(err, res) {
                if (err) throw err;
                console.log("1 order updated");     
                               
                response.send(true);
                db.close();
              });
                    // #
              db.close();
            });
          }); 
        //partial delivery end
    }

    
    // ##################

    // Item.create(req.body, function (err, item) {
    //   if (err) return next(err);
    //   res.json(item);
    // });
  });
  

/* GET SINGLE Order BY req ID */
router.get('/req/:id', function(req, res, next) {

   console.log(req.params.id);
   var stringArr = req.url.split('id=');
   var reqIdInOrderObj  = stringArr[1]; 

   var MongoClient = require("mongodb").MongoClient;
   var url = dbCon.mongoURIConnString;

   MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ProcurementDB");
    dbo
      .collection("Orders")
      .find({requisitionId: reqIdInOrderObj })
      .toArray(function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
        db.close();
      });
  });

});

/* GET ALL Settings */
// router.get("/", function (req, res, next) {
//   var MongoClient = require("mongodb").MongoClient;
//   var url = dbCon.mongoURIConnString;

//   MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("ProcurementDB");
//     dbo
//       .collection("Settings")
//       .find({})
//       .toArray(function (err, result) {
//         if (err) throw err;
//         // console.log(result);
//         res.send(result);
//         db.close();
//       });
//   });
// });

module.exports = router;

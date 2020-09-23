var express = require('express');
var router = express.Router();
var Item = require('../models/Item');

/* GET ALL Items */
router.get('/all', function(req, res, next) {
    Item.find(function (err, items) {
        if (err) return next(err);
        res.json(items);
    });
});
  
/* GET SINGLE Item BY ID */
router.get('/:id', function(req, res, next) {
  Item.findById(req.params.id, function (err, item) {
        if (err) return next(err);
        res.json(requisition);
    });
});
  
/* POST - Register a Item */
router.post('/register', function(req, res, next) {
    Item.create(req.body, function (err, item) {
        if (err) return next(err);
        res.json(item);
    });
});
  
/* UPDATE Item */
router.put('/:id', function(req, res, next) {
    Item.findByIdAndUpdate(req.params.id, req.body, function (err, item) {
        if (err) return next(err);
        res.json(item);
    });
});
  
/* DELETE Item */
router.delete('/:id', function(req, res, next) {
    Item.findByIdAndRemove(req.params.id, req.body, function (err, item) {
        if (err) return next(err);
        res.json(item);
    });
});

module.exports = router;
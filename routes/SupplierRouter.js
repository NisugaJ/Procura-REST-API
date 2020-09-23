var express = require('express');
var router = express.Router();
var Supplier = require('../models/Supplier');

/* GET ALL Supplier */
router.get('/all', function(req, res, next) {
    Supplier.find(function (err, suppliers) {
        if (err) return next(err);
        res.json(suppliers);
    });
});
  
/* GET SINGLE Supplier BY ID */
router.get('/:id', function(req, res, next) {
    Supplier.findById(req.params.id, function (err, supplier) {
        if (err) return next(err);
        res.json(supplier);
    });
});
  
/* POST - Register a Supplier */
router.post('/register', function(req, res, next) {
    Supplier.create(req.body, function (err, supplier) {
        if (err) return next(err);
        res.json(supplier);
    });
});
  
/* UPDATE Supplier */
router.put('/:id', function(req, res, next) {
    Supplier.findByIdAndUpdate(req.params.id, req.body, function (err, supplier) {
        if (err) return next(err);
        res.json(supplier);
    });
});
  
/* DELETE Supplier */
router.delete('/:id', function(req, res, next) {
    Supplier.findByIdAndRemove(req.params.id, req.body, function (err, supplier) {
        if (err) return next(err);
        res.json(supplier);
    });
});

module.exports = router;
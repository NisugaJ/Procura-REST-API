var express = require('express');
var 


router = express.Router();
var Requisition = require('../models/Requisition');

/* GET ALL Requisitions */
router.get('/all', function(req, res, next) {
  Requisition.find(function (err, requisitions) {
        if (err) return next(err);
        res.json(requisitions);
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
  Requisition.create(req.body, function (err, requisition) {
        if (err) return next(err);
        res.json(requisition);
    });
});
  
/* UPDATE Requisition */
router.put('/:id', function(req, res, next) {
  Requisition.findByIdAndUpdate(req.params.id, req.body, function (err, requisition) {
        if (err) return next(err);
        res.json(requisition);
    });
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
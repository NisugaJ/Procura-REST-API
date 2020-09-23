var express = require('express');
var router = express.Router();
var SiteManagers = require('../models/SiteManager');

/* GET ALL SiteManagers */
router.get('/all', function(req, res, next) {
    SiteManagers.find(function (err, siteManagers) {
        if (err) return next(err);
        res.json(siteManagers);
    });
});
  
/* GET SINGLE SiteManagers BY ID */
router.get('/:id', function(req, res, next) {
    SiteManagers.findById(req.params.id, function (err, siteManagers) {
        if (err) return next(err);
        res.json(siteManagers);
    });
});
  
/* POST - Register a SiteManager */
router.post('/register', function(req, res, next) {
    SiteManagers.create(req.body, function (err, siteManager) {
        if (err) return next(err);
        res.json(siteManager);
    });
});
  
/* UPDATE SiteManager */
router.put('/:id', function(req, res, next) {
    SiteManagers.findByIdAndUpdate(req.params.id, req.body, function (err, siteManager) {
        if (err) return next(err);
        res.json(siteManager);
    });
});
  
/* DELETE SiteManager */
router.delete('/:id', function(req, res, next) {
    Cases.findByIdAndRemove(req.params.id, req.body, function (err, siteManager) {
        if (err) return next(err);
        res.json(siteManager);
    });
});

module.exports = router;
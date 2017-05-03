var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var promotion = require('../models/promotions');

var promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get(function(req,res,next){
      promotion.find({}, function (err, promo) {
        if (err) return next(err);
        //console.log(Dishes);
        res.json(promo);
    });
})

promoRouter.route('/:promoId')
.get(function(req,res,next){
    promotion.findById(req.params.promoId,function(err,promo){
      res.json(promo);
    });
       // res.end('Will send details of the promo: ' + req.params.promoId +' to you!');
})

//**** Assignmetn 3 allowing only admin usres to access the put, post, delete operations. ***
promoRouter.use(Verify.verifyOrdinaryUser,Verify.verifyAdmin)
promoRouter.route('/').post(function(req, res, next){
    promotion.create(req.body, function (err, promo) {
        if (err) return next(err);
        console.log('promo created!');
        var id = promo._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the promo with id: ' + id);
    });
    //res.end('we Will add the promo: ' + req.body.name + 'and with details: ' + req.body.description);    
})

.delete(function(req, res, next){

    promotion.remove({},function(err,resp){
      if(err) return next(err);
      res.json(resp);
    });
       // res.end('Deleting all promo');
});




promoRouter.route('/:promoId').put(function(req, res, next){

    promotion.findByIdAndUpdate(req.params.promoId,{
      $set: req.body 
    },{
      new: true
    }, function(err, promo){
      if (err) return next(err);
      res.json(promo);
    });
    //res.write('Updating the promo: ' + req.params.promoId + '\n');
    //res.end('Will update the promo: ' + req.body.name + 
    //      ' with details: ' + req.body.description);
})

.delete(function(req, res, next){
    promotion.findByIdAndRemove(req.params.promoId, function(err, resp){
      if (err) return next(err);
      res.json(resp);
    })
       // res.end('Deleting promo: ' + req.params.promoId);
});

module.exports = promoRouter

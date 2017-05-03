var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var leadership = require('../models/leadership');

var leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

.get(function(req,res,next){
      leadership.find({}, function (err, leader) {
        if (err) return next(err);
        //console.log(Dishes);
        res.json(leader);
    });
})

.post(function(req, res, next){
    leadership.create(req.body, function (err, leader) {
        if (err) return next(err);
        console.log('Leader created!');
        var id = leader._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the Leader with id: ' + id);
    });
    //res.end('we Will add the leader: ' + req.body.name + 'and with details: ' + req.body.description);    
})

.delete(function(req, res, next){

    leadership.remove({},function(err,resp){
      if(err) return next(err);
      res.json(resp);
    });
       // res.end('Deleting all leader');
});

leaderRouter.route('/:leaderId')
.get(function(req,res,next){
    leadership.findById(req.params.leaderId,function(err,leader){
      res.json(leader);
    });
       // res.end('Will send details of the leader: ' + req.params.leaderId +' to you!');
})

.put(function(req, res, next){

    leadership.findByIdAndUpdate(req.params.leaderId,{
      $set: req.body 
    },{
      new: true
    }, function(err, leader){
      if (err) return next(err);
      res.json(leader);
    });
    //res.write('Updating the leader: ' + req.params.leaderId + '\n');
    //res.end('Will update the leader: ' + req.body.name + 
    //      ' with details: ' + req.body.description);
})

.delete(function(req, res, next){
    leadership.findByIdAndRemove(req.params.leaderId, function(err, resp){
      if (err) return next(err);
      res.json(resp);
    })
       // res.end('Deleting leader: ' + req.params.leaderId);
});

module.exports = leaderRouter

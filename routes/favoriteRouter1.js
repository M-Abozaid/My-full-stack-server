var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify')
var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(Verify.verifyOrdinaryUser,function (req, res, next) {
    req.body.userId = req.decoded._doc._id; 
    Favorites.find({'userId':req.body.userId })
        .populate('userId dishId')
        //.populate('dishId')
        .exec(function (err, favorite) {
        if (err) throw err;
        res.json(favorite);
    });
})

.post(Verify.verifyOrdinaryUser,  function (req, res, next) {
        req.body.userId = req.decoded._doc._id; 
        query = Favorites.findOne({'userId':req.body.userId },function(err, query) { 
        
        if (err) throw err;
        if(query){
            console.log('query.dishId ', query.dishId);
        if ( query.dishId.find((element)=>{
            if(element == req.body.dishId){
             return true   
            }
        })){return res.end('Already added' )}
        query.dishId.push(req.body.dishId);
        query.save(function (err, query) {
            if (err) throw err;
            console.log('added dish!');
            res.json(query);
        });
        }else{
            Favorites.create(req.body, function(err, favorite){
                if (err) throw err;
                console.log('favorite added');
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Added the user with id: ' + req.body.userId );
            })
        }
    });
        
    
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    req.body.userId = req.decoded._doc._id;
    Favorites.remove({'userId':req.body.userId }, function (err) {
        if (err) throw err;
        //res.json(resp);
         res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('all favorites are Removed'  );
    });
});


favoriteRouter.route('/:favoriteId')

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        req.body.userId = req.decoded._doc._id; 
        favorite = Favorites.findOne({'userId':req.body.userId },(err, fav) => { 
        console.log('favorite ',fav);
        console.log('favorite.dishId ',fav.dishId);
        fav.dishId.forEach((dish) => { 
            console.log('dish inside forEach ',dish);
            console.log('req.params.favoriteId  ',req.params.favoriteId);
            if(dish == req.params.favoriteId)
            {
                console.log('dish id ',dish);
                fav.dishId.splice(fav.dishId.indexOf(dish),1);
            }
            });

        fav.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });

       });

        
        
});

module.exports = favoriteRouter;
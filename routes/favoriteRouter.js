var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify')
var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

var favorites;

//Assignment 4 verifying the user once for all favoriteRouter end points
//also quirying favorites once to be avaliable for all favoriteRouter end points
favoriteRouter.use(Verify.verifyOrdinaryUser,(req, res, next)=>{
    req.body.postedBy = req.decoded._id; 
    favorites = Favorites.findOne({'postedBy':req.body.postedBy })
    next();
});

favoriteRouter.route('/')
.get(function (req, res, next) {
        favorites
        .populate('postedBy dishesId._id')  // populating the user and dish references
        .exec(function (err, favorite) {
        if (err) return next(err);
        res.json(favorite);
    });
})

.post(function (req, res, next) {
    favorites
    .exec((err,fav)=>{
        if(fav){        //First chicking if there is a favorite list
        favorites.findOne({'dishesId._id':req.body._id},(err,dish)=>{
            if (dish){      //chicking if the dish already exists on the list
                    return res.end('Already added' ) 
                }else{      // adding new dish to favorites
                    fav.dishesId.push({'_id':req.body._id});
                    fav.save(function (err, fav) {
                        if (err) return next(err);
                        res.json(fav);
                    });
                }
        });
        }else{      //creating favorite list and adding the first dish
                Favorites.create(req.body, function(err, favorite){
                if (err) return next(err);
                    favorite.dishesId.push({'_id':req.body._id})
                    favorite.save(function (err, query) {
                        if (err) return next(err);
                        console.log('added dish!');
                        res.json(query);
                    })
                    
                })
        
            }
    })
})
        
    


.delete( function (req, res, next) {
    favorites.remove().exec(function (err) {
        if (err) return next(err);
         res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('all favorites are Removed'  );
    })
});



favoriteRouter.route('/:favoriteId')
.delete( function (req, res, next) {
        favorites.exec((err, fav) => { 
        console.log('favorite ',fav);
        fav.dishesId.id(req.params.favoriteId).remove();
        fav.save(function (err, list) {
                    if (err) return next(err);
                    console.log('removed dish!');
                    res.json(list);
                })

       });   
});

module.exports = favoriteRouter;
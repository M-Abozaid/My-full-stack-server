var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify')
var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

var favorites;

favoriteRouter.use(Verify.verifyOrdinaryUser,(req, res, next)=>{
    req.body.postedBy = req.decoded._doc._id; 
    favorites = Favorites.findOne({'postedBy':req.body.postedBy })
    console.log(favorites);
    next();
});

favoriteRouter.route('/')
.get(function (req, res, next) {
    console.log('inside get');
        favorites
        .populate('postedBy dishId')
        .exec(function (err, favorite) {
                console.log('inside exec');
        if (err) throw err;
        res.json(favorite);
    });
})

.post(function (req, res, next) {
        favorites.find({'dishId':req.body.dishId}).find((err,dish)=>{
                if (dish){return res.end('Already added' )}
            });
        favorites
        .exec((err,fav)=>{
            if(fav){
            favorites.dishId.push(req.body.dishId);
            favorites.save(function (err, fav) {
                if (err) throw err;
                res.json(fav);
            });
            }else{
                Favorites.create(req.body, function(err, favorite){
                if (err) throw err;
                console.log('favorite created ',favorite); 
                
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('successfully added to favorites' + req.body.postedBy );        
            })
            
        }
        })
    })
        
    
/*

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    favorites.remove().exec(function (err) {
        if (err) throw err;
        //res.json(resp);
         res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('all favorites are Removed'  );
    })
    });



favoriteRouter.route('/:favoriteId')
.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        favorites.exec((err, fav) => { 
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
*/
module.exports = favoriteRouter;
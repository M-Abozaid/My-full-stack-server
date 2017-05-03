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
    favorites = Favorites.findOne({'postedBy':req.body.postedBy },function(err,fav){
        req.body.favorites = fav;
        console.log('favorites inside findOne', req.body.favorites);
        next();
    });
    console.log('favorites inside use', req.body.favorites);
    
});

favoriteRouter.route('/')
.get(Verify.verifyOrdinaryUser,function (req, res, next) {
    console.log('inside get');
    console.log('favorites inside get', req.body.favorites);
        req.body.favorites.populate('postedBy dishId')
        //.populate('dishId')
        .exec(function (err, favorite) {
                console.log('inside exec');
        if (err) throw err;
        res.json(favorite);
    });
})

.post(Verify.verifyOrdinaryUser,  function (req, res, next) {
        //console.log('fav.postedBy ', req.body.favorites.postedBy);
        if(req.body.favorites){
        console.log('favorites.dishes ', req.body.favorites.dishId);
        if ( req.body.favorites.dishId.find((element)=>{
            if(element == req.body.dishId){
             return true   
            }
        })){return res.end('Already added' )}
        req.body.favorites.dishId.push(req.body);
        req.body.favorites.save(function (err, favorites) {
            if (err) throw err;
            console.log('added dish!');
            res.json(favorites);
        });
        }else{
            //req.body.dishes[0] = req.body._id ;
            //req.body.postedBy = req.decoded._doc._id;
            //fav = {"postedBy":req.body.postedBy}
            Favorites.create(req.body, function(err, favorite){
                if (err) throw err;
                console.log('favorite created ',favorite); 
                
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Added the user with id: ' + req.body.postedBy );        
            })
            
        }
    });
        
    

/*
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
*/
module.exports = favoriteRouter;
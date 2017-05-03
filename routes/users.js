var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var mongoose = require('mongoose');
var Verify    = require('./verify');


//***** Assignmet 3 displaying a list of users that only admin can see *****
/* GET users listing. */
router.get('/',Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  //res.send('respond with a resource');
  User.find({}, function (err, user) {
        if (err) throw err;
        console.log(user);
        res.json(user);
    });
});


// Of course I'll allow the ordinary user to make post requests on register, login, and logout for him to be able to use the app
router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }),
        req.body.password, function(err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }
                if(req.body.firstname) {
            user.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
            user.lastname = req.body.lastname;
        }
        user.save(function(err,user) {
          passport.authenticate('local')(req, res, function () {
            return res.status(200).json({status: 'Registration Successful!'});
            });
        });
    });
});

router.get('/facebook', passport.authenticate('facebook'),
  function(req, res){});

router.get('/facebook/callback', function(req,res,next){
  passport.authenticate('facebook', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
              var token = Verify.getToken(user);
              res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {  // passport.authenticate with a custom callback
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
       console.log(req.logIn);
       var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
              res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);  //   ???????????????????????????????????????????????
});

router.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

module.exports = router;
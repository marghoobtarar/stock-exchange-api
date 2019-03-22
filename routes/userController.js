var mongoose = require('mongoose');
var db = require('../models/db');
var Token = mongoose.model('Token');
var Account = mongoose.model('Account');
var express = require('express');
var router = express.Router();

exports.confirmationPost = function(req,res,next){
    var Originalurl = req.originalUrl; 
    var path = Originalurl.split('/');
    var token = path[2]
    Token.findOne({ token: token }, function (err, token) {
        console.log(req.originalUrl);
         if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
      
         Account.findOne({ _id: token._userId }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
        
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
               
                res.redirect('/#/login');

            });});});
           
        }

        exports.forgetPassword=function(req,res,next){

            var Originalurl = req.originalUrl; 
            var path = Originalurl.split('/');
            var token = encodeURIComponent(path[2])
            console.log('marghoob');
            console.log(token)
          
                res.redirect('/#/reEnterPassword?valid='+token);

        }

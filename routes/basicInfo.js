var mongoose = require('mongoose');
var db = require('../models/db');
var Account = mongoose.model('basic');
var express = require('express');
var router = express.Router();

router.route('/basic').post(function(req,res){
    var account = new Account();
    console.log(req.body.user_register)
    account.user_register = req.body.user_register;
    account.user_register = req.body.user_register
    account.resident1 = req.body.resident1;
    account.resident2 = req.body.resident2;   
    account.city = req.body.selectedOption;
    account.zip = req.body.zip;
    account.cell_number = req.body.cell_number;

    account.save( account,function(err,account){
       
        if (err){
            console.log("account");

            return res.send(500, err);
        }
        return res.send('inserted data');
    })
}).get(function(){
    console.log('im very good');
})
module.exports = router;
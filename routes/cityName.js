var mongoose = require('mongoose');
var db = require('../models/db');
var cityname = mongoose.model('cityName');
var express = require('express');
var router = express.Router();

router.route('/city').get(function(req,res){
    cityname.find(function(err,city){
        if(err){

            return res.send(500,err)
        }

        return res.send(city);
    })
    
})
module.exports = router;
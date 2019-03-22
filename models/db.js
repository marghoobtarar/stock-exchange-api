var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstname:{type: String,
            },
    lastname:{type: String,
            },
    email:{type: String,
                required: true},
    password:{
                    type:String,
                    required:true
                    
                },
isVerified: { type: Boolean, default: false },

passwordResetToken:{ type:String,default:null}
//passwordResetExpires: Date



})
var tokenSchema = new Schema({
        _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, //token issued to the user
        token: { type: String, required: true },
        createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }//powerful feature which will store TTL
})

var resetPasswordSchema = new Schema({
        _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, //token issued to the user
        token: { type: String, required: true },
        createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }//powerful feature which will store TTL
})
var basicSchema = new Schema({
        user_register:{
                type:String
        },
        resident1:{
                type:String,
        },
        resident2:{
                type:String,
        },
        city:{
                type:String,
        },
        zip:{
                type:String,
        
        },
        cell_number:{
                type:String,
        }

})
var CitySchema = new Schema({

        cityName:{type:String,},
        cityZip:{type:String,}
})
module.exports = mongoose.model('basic',basicSchema,'basic');
module.exports= mongoose.model('Account',UserSchema,'Account')
module.exports = mongoose.model('cityName',CitySchema,'cityName');
module.exports = mongoose.model('Token',tokenSchema,'Token')
module.exports = mongoose.model('PasswordToken',resetPasswordSchema,'PasswordToken')
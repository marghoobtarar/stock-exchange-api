var express = require('express');
var router = express.Router();
var nodeMailer = require('nodemailer')
var crypto = require('crypto-browserify');

var mongoose = require('mongoose');  
var User = mongoose.model('Account');
var Token = mongoose.model('Token');
var Password = mongoose.model('PasswordToken')
var bodyParser = require('body-parser')
var bCrypt = require('bcrypt-nodejs');


router.route('/sendResetPassword').post(function(req,res,next){
    console.log('send reset password again')
    console.log(req.body.email);
var useremail = req.body.email;

User.findOne({email:useremail},function(err,user){
if(err){
    res.send(err)

}

var token = new Password({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') })

token.save(function (err) {
    if (err) { return res.status(500).send({ msg: err.message })}
    console.log('sending token')
    var transporter = nodeMailer.createTransport({
        service: 'Gmail',
        
        port: 465,
        secure: true,
        auth: {
            user: 'marghoobahmad0344@gmail.com',
            pass: 'aimariaz786'}
    })
var mailOptions = {
        from: '"marghoob ahmad" <marghoobahmad0344@gmail.com>', // sender address
        to: useremail , // list of receivers
        subject: 'Password Reset Token',
        text: 'Hello,\n\n' + 'Please reset your password by clicking the link: \nhttp:\/\/' + req.headers.host + '\/resetPassword\/' + token.token + '.\n'
    }
    transporter.sendMail(mailOptions,(error)=>{
        if (err) { return res.status(500).send({ msg: err.message });}
        res.status(200).send('A verification email has been sent to ' + useremail + '.');
        console.log('token sended')
    })
})

res.send('done');

})
})











    router.route('/sendNotification').post(function(req,res){

        var email = req.body.to
        var subject = req.body.subject
        var body = req.body.body;
        console.log('im vert good');

        var transporter = nodeMailer.createTransport({
            service: 'Gmail',
            
            port: 465,
            secure: true,
            auth: {
                user: 'marghoobahmad0344@gmail.com',
                pass: 'aimariaz786'}
        })
    var mailOptions = {
            from: '"marghoob ahmad" <marghoobahmad0344@gmail.com>', // sender address
            to:email , // list of receivers
            subject:subject , // Subject line
            text: body, // plain text body
            html: '<b>fuck you arhum ali you ediot</b>' // html body
        };
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return console.log(error);
            }
            console.log('good boy');
            res.send('very');
            });
    })
    
    router.route('/sendTokenAgian').post(function(req,res,next){
        console.log('send token again')
        console.log(req.body.username);
var useremail = req.body.username;

  User.findOne({email:useremail},function(err,user){
    if(err){
        res.send(err)

    }
  
    var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') })

    token.save(function (err) {
        if (err) { return res.status(500).send({ msg: err.message })}
        console.log('sending token')
        var transporter = nodeMailer.createTransport({
            service: 'Gmail',
            
            port: 465,
            secure: true,
            auth: {
                user: 'marghoobahmad0344@gmail.com',
                pass: 'aimariaz786'}
        })
    var mailOptions = {
            from: '"marghoob ahmad" <marghoobahmad0344@gmail.com>', // sender address
            to: useremail , // list of receivers
            subject: 'Account Verification Token',
            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n'
        }
        transporter.sendMail(mailOptions,(error)=>{
            if (err) { return res.status(500).send({ msg: err.message });}
            res.status(200).send('A verification email has been sent to ' + useremail + '.');
            console.log('token sended')
        })
    })
    
    res.send('done');

})
    })

router.route('/passwordReset').post(function(req,res,next){
console.log('im marghoob')
var token =req.body.token.valid;
   console.log(token)
   console.log(req.body.pass1)
   var changePassword = createHash(req.body.pass1)
Password.findOne({token:token},function(err,pass){
    if(err){
        res.send(err)
    }
    User.update({"_id":pass._userId},{"$set":{"password":changePassword}},function (err,user) {
if(err){res.send(err);
} 
console.log(user.password);
    })
res.send('done')
})})

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

    module.exports = router;

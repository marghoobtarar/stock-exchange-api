var express = require('express');
var router = express.Router();
require('../models/db') 
var bCrypt = require('bcrypt-nodejs');
var nodeMailer = require('nodemailer')
var crypto = require('crypto-browserify');
var mongoose = require('mongoose');  
var User = mongoose.model('Account');
var Token = mongoose.model('Token');
var flash=require("connect-flash");
//var User = mongoose.model('users');
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	//sends successful login state back to angular
	router.get('/success', function(req, res){
      console.log(req.cookies.sid)

     //   console.log(req.session.passport.user)
     //console.log(req.user)
     //console.log(req.session);

		res.send({state: 'success', user: req.user ? req.user : null});
	});

	//sends failure login state back to angular
	router.get('/failure', function(req, res,info){

       var msg= req.flash('nouser');

       var token= req.flash('notoken');

       var pass= req.flash('nopassword');
      
      

if(msg[0]!=null){
  
    res.send({state: 'noUser', user: null, message: msg})
    console.log('user')
    console.log(msg)


}
 else if(token[0]!=null){
    console.log('token')

    res.send({state: 'noToken', user: null, message: token});
    console.log(token) 

   }
else if(pass[0]!=null){
    console.log('pass')

    res.send({state: 'passwordWrong', user: null, message: pass});

    console.log(pass)


}

	});
 






    
	//log in
	router.post('/login', passport.authenticate('login',{
       
		successRedirect: '/auth/success',
        failureRedirect: '/auth/failure',
        faliureFlash:true
    }));
    
   // , function(req,res,next){console.log('im user')console.log('ím login'+req.user.firstname);

    

	//sign up
	router.post('/signup', function(req,res){
    // find a user in mongo with provided username
  firstname= req.body.firstname;
  email = req.body.email;
  lastname = req.body.lastname;
  password = req.body.password;
    User.findOne({ 'firstname' : firstname }, function(err, user) {
        // In case of any error, return using the done method
        if (err){
            console.log('Error in SignUp: '+err);
            return done(err);
        }
        // already exists
        if (user) {
            console.log('User already exists with firstname: '+firstname);
            res.status(500).send('User  already exists')
        } else {
            // if there is no user, create the user
            var newUser = new User();
            newUser.firstname =firstname;
            newUser.lastname =lastname;
            newUser.email = email;
            newUser.password = createHash(password);

            // save the user
            newUser.save(function(err,user){ 
                if (err) {
                res.status(500).send('db error')
            } else {
                var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') })
                token.save(function (err) {
                    if (err) { return res.status(500).send({ msg: err.message })}
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
                        subject: 'Account Verification Token',
                        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n'
                    }
                    transporter.sendMail(mailOptions,(error)=>{
                        if (err) { return res.status(500).send({ msg: err.message });}
                        res.status(200).send('A verification email has been sent to ' + user.email + '.');
                    })
                })
                
                res.redirect('/auth/success');
            }});
        }
    })});
    router.post('/sessionExpire',function(req,res,done){
      console.log('im in session handling');
      user_session={
       
        firstname:'',
        lastname:'',
        email:'' ,

    }
       if(req.cookies.mycookie == req.session.token && req.cookies.mycookie != null ){
            
             User.findOne({'_id': req.session.passport.user},function(err,user){    
                 console.log("this is user id"+user._id);
                {
                 user_session.firstname = user.firstname;
                 user_session.lastname = user.lastname;
                 user_session.email = user.email;
                 
                 console.log('yes user is done'+user_session.email);
                 res.send({state: 'success',user:user_session?user:null});
                 }
  // return done(null,user)
            //  res.send({state: 'success',userdata:user?userdata:null});

           });
      
          // console.log('yes please'+user_session.email);

        }
        else{
            res.send({state: 'false'});

        }


    })
   

    //log out
    router.post('/signout', function(req, res) {
        console.log('im signouted');
     //console.log(req.session.passport.user)
     // console.log('logout the session');
        
        req.logout();
        res.clearCookie("mycookie");
        req.session.destroy();
		res.send({state: 'success'});
	});
    var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };


router.post('/userdata',function(req,res,done){
    console.log('in user')
    //there the mycookie store in side of session
console.log(req.session.token);
 
res.send({state:"success"});


})


	return router;
   
}






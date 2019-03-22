var mongoose = require('mongoose');   
var User = mongoose.model('Account');
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(req,user, done) {
        console.log('serializing user:',user.firstname);
       // req.session.passport.user={id:user._id}
       console.log('prinitng cookie')
       console.log(req.sessionID);

       
		done(null, user._id);
	});


	
	passport.deserializeUser(function(req,id, done) {
		User.findById(id, function(err, user) {
            req.session.token = req.cookies.mycookie;
            console.log(req.session.token)

			console.log('deserializing user:',user. email);
			done(err, user);
		});
	});

  
    
    passport.use('login', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) { 
        // check in mongo if a user with username exists or not
        User.findOne({ 'email' :  username }, 
            function(err, user) {
                // In case of any error, return using the done method
                if (err)
                    return done('error is there');
                // Username does not exist, log the error and redirect back
                if (!user){
                    console.log('User Not Found with username '+username);
                    return done(null, false,req.flash('nouser', 'SORRY YOU HAVE NO ACCOUNT ON THIS EMAIL PLEAE REGISTER YOURSELF'));                 
                }
                if (!user.isVerified) return done(null, false,req.flash('notoken', 'SORRY YOUR ACCOUNT IS NOT VERIFIED')); // redirect back to login page
 
                // User exists but wrong password, log the error 
                if (!isValidPassword(user, password)){
                    console.log('Invalid Password');
                    return done(null, false,req.flash('nopassword', 'SORRY YOU ENTERED WRONG PASSWORD')); // redirect back to login page
                }
                // User and password both match, return user from done method
                // which will be treated like success
                return done(null, user);
            }
        );
    }
));



var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
};


};
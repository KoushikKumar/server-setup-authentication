const passport = require("passport");
const User = require("../models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");
const dotenv = require('dotenv');

dotenv.load();

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.SECRET_STRING
    
};

const localOptions = {
    usernameField: 'userName'
};

const localLogin = new LocalStrategy(localOptions, function(userName, password, done){
    User.findOne({userName:userName.toLowerCase()}, function(err, user) {
        if(err) {
            return done(err, false);
        }
        if(!user) {
            return done(null, false);
        }
        user.comparePasswords(password, function(err, isMatch){
            if(err) {
                return done(err, false);
            }
            if(!isMatch) {
                return done(null, false);
            }
            return done(null, user);
        });
    });  
});

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    User.findOne({userName: payload.sub}, function(err, user) {
        if(err) {
            return done(err, false);
        }
        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);
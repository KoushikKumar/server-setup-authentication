const User = require("../models/user");
const jwt = require("jwt-simple");
const dotenv = require('dotenv');

dotenv.load();

function tokenForUser(user) {
    const timeStamp = new Date().getTime();
    return jwt.encode({ sub: user.userName, iat: timeStamp }, process.env.SECRET_STRING);
}

exports.signin = function(req, res, next) {
    res.json({token: tokenForUser(req.user)});
};

exports.signup = function(req, res, next) {
    const userName = req.body.userName.toLowerCase();
    const password = req.body.password;
    const address = req.body.address;
    
    if(!userName || !password || !address) {
        return res.status(422).send({ error: "You must provide username, password and address"});
    }
    
    
    User.findOne({ "userName": userName }, function(err, existingUser) {
        if(err) {
           next(err);
        } 
       
        if( existingUser ) {
            return res.status(422).send({ error: "UserName already in use"});
        }
       
        const user = new User({
            userName: userName,
            password: password,
            address: address
        });
       
        user.save(function(err) {
            if(err) {
                return next(err);
            }
            res.json({token: tokenForUser(user)});
        });
    });
};
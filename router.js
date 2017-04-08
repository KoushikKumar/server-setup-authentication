const Authentication = require("./controllers/authentication");
const passportService = require("./services/passport");
const passport = require("passport");

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function(app) {
    app.get('/', requireAuth, function(req, res){
        res.send('hello'); 
    });
    app.post('/signin', requireLogin, Authentication.signin);
    app.post('/signup', Authentication.signup);
};
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/UserModel.js');

module.exports = function(app, express, passport) {
  app.use(session({
    name: 'sentimize',
    secret: 'chkakaja',
  }))

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use('local', new LocalStrategy(
    function(username, password, done) {
      User.where('username', username).fetch().then(function(user){
        if(!user) {
          return done(null, false, {message: 'Incorrect username.'});
        }
        if (!user.validPassword(password)) {
          return done(null, false, {message: 'Incorrect password.'});
        }
        return done(null, user);
      })
      .catch(function(err) {
        console.error(err);
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.where('id', id).fetch().then(function(user) {
      done(err, user);
    })
    .catch(function(err) {
      console.error(err);
    })
  });

  console.log('passport in auth.js', passport);
}

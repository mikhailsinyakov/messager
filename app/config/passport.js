'use strict';

const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/users');

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        Users.findById(id, (err, user) => {
            done(err, user);
        })
    });

    passport.use('local-signup', new LocalStrategy((username, password, done) => {
        if (username == 'current') return done(null, false);
        
        Users.findOne({username}, (err, user) => {
            if (err)  return done(err);
            if (user) return done(null, false);
            else {
                const newUser = new Users({username});
                newUser.password = newUser.generateHash(password);
                newUser.save((err, user) => {
                    if (err) return done(err);
                    return done(null, user);
                });
            }
        });

        
    }));

    passport.use('local-login', new LocalStrategy((username, password, done) => {
        Users.findOne({username}, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user || !user.verifyPassword(password)) {
                return done(null, false);
            }
            return done(null, user);
        });
    }));
};
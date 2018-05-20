'use strict';

const passport = require('passport');
const UserController = require('../controllers/userController.server');
const userController = new UserController();

module.exports = app => {
    /*app.get('/', (req, res) => {
        res.sendFile('/index.html');
    });

    app.get('/login', (req, res) => {
        res.sendFile('/login.html');
    });

    app.get('/signup', (req, res) => {
        res.sendFile('/signup.html');
    });*/
            
    app.post('/login', 
        passport.authenticate('local-login', {
            successRedirect: '/index.html',
            failureRedirect: '/login.html'
        })
    );

    app.post('/signup', 
        passport.authenticate('local-signup', {
            successRedirect: '/index.html',
            failureRedirect: '/signup.html'
        })
    );

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/login.html');
    })

};
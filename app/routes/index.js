'use strict';

const passport = require('passport');
const UserController = require('../controllers/userController.server');
const userController = new UserController();

module.exports = app => {
    app.get('/', (req, res) => {
        res.sendFile('/index.html');
    });

    app.get('/api/getUsername', (req,res) => {
        const username = req.user ? req.user.username : null;
        res.send(username);
    });
            
    app.post('/login', 
        passport.authenticate('local-login', {
            successRedirect: '/',
            failureRedirect: '/'
        })
    );

    app.post('/signup', 
        passport.authenticate('local-signup', {
            successRedirect: '/',
            failureRedirect: '/'
        })
    );

    app.get('/logout', (req, res) => {
        console.log('logout')
        req.logout();
        res.send(200);
    })

};
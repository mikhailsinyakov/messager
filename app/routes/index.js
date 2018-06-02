'use strict';

const UserController = require('../controllers/userController.server');
const AuthController = require('../controllers/authController.server');

const userController = new UserController();
const authController = new AuthController();

module.exports = app => {
    app.get('/', (req, res) => {
        res.sendFile('/index.html');
    });

    app.route('/api/users/:username')
        .get(userController.getUserInfo)
        .patch(userController.changeUserInfo)
            
    app.post('/login', authController.viaLogin);
    app.post('/signup', authController.viaSignup);

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })

};
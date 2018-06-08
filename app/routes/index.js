'use strict';

const UserController = require('../controllers/userController.server');
const AuthController = require('../controllers/authController.server');
const ImageController = require('../controllers/imageController.server');

const userController = new UserController();
const authController = new AuthController();
const imageController = new ImageController();

module.exports = app => {

    app.get('/', (req, res) => res.sendFile('/index.html'));

    app.route('/api/users/:username')
        .get(userController.getUserInfo)
        .patch(userController.changeUserInfo);

    app.route('/api/users/:username/files/:name')
        .get(imageController.getImage)
        .put(imageController.uploadImage);
            
    app.post('/login', authController.viaLogin);
    app.post('/signup', authController.viaSignup);

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.all('*', (req, res) => {
        res.status(405).send({status: 'Method not allowed'});
    });

};
'use strict';

const UserController = require('../controllers/userController.server');
const AuthController = require('../controllers/authController.server');
const UploadController = require('../controllers/uploadController.server');

const userController = new UserController();
const authController = new AuthController();
const uploadController = new UploadController();

module.exports = app => {
    app.get('/', (req, res) => {
        res.sendFile('/index.html');
    });

    app.get('/testFetch', (req, res) => {
        res.status(404).send({status: 'Not found'})
        //res.send({message: 'ok'})
    });

    app.route('/api/users/:username')
        .get(userController.getUserInfo)
        .patch(userController.changeUserInfo)

    app.put('/api/users/:username/files/:name', uploadController.uploadAvatar)
            
    app.post('/login', authController.viaLogin);
    app.post('/signup', authController.viaSignup);

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })

};
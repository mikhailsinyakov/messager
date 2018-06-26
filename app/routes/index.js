'use strict';

const UserController = require('../controllers/userController.server');
const AuthController = require('../controllers/authController.server');
const ImageController = require('../controllers/imageController.server');
const FriendshipController = require('../controllers/friendshipController.server');
const DialogController = require('../controllers/dialogController.server');

const userController = new UserController();
const authController = new AuthController();
const imageController = new ImageController();
const friendshipController = new FriendshipController();
const dialogController = new DialogController();

module.exports = app => {

    app.get(/^\/(?!(api\/|public\/))\S*/, (req, res) => {
        res.sendFile(process.cwd() + '/public/index.html');
    });

    app.get('/api/users', userController.getUsers);

    app.route('/api/users/:username')
        .get(userController.getUserInfo)
        .patch(userController.changeUserInfo);

    app.route('/api/users/:username/friends')
        .get(friendshipController.getFriendRequestsInfo);

    app.route('/api/users/:username/dialogs')
        .get(dialogController.getAllDialogsInfo);

    app.route('/api/users/:username/friends/:friendUsername')
        .put(friendshipController.changeFriendshipState);

    app.route('/api/users/:username/dialogs/:penPalUsername')
        .get(dialogController.getDialogInfo);
    
    app.route('/api/users/:username/files/:name')
        .get(imageController.getImage)
        .put(imageController.uploadImage);
            
    app.post('/login', authController.viaLogin);
    app.post('/signup', authController.viaSignup);

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.all('*', (req, res) => {
        res.status(405).send({status: 'Method not allowed'});
    });

};
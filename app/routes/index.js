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
        (req, res) => {
            passport.authenticate('local-login', (err, user) => {
                if (err) {
                    return res.status(500).send('Произошла ошибка, попробуйте снова');
                }
                if (!user) {
                    return res.status(401).send('Неверное имя пользователя или пароль');
                }
                req.logIn(user, err => {
                    if (err) {
                        return res.status(500).send('Произошла ошибка, попробуйте снова');
                    }
                    return res.sendStatus(200);
                })
            })(req, res);
        });

    app.post('/signup', 
    (req, res) => {
        passport.authenticate('local-signup', (err, user) => {
            if (err) {
                return res.status(500).send('Произошла ошибка, попробуйте снова');
            }
            if (!user) {
                return res.status(401).send('Пользователь с таким именем уже существует');
            }
            req.logIn(user, err => {
                if (err) {
                    return res.status(500).send('Произошла ошибка, попробуйте снова');
                }
                return res.sendStatus(200);
            })
        })(req, res);
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })

};
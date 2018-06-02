'use strict';

const passport = require('passport');

module.exports = function () {

    this.viaLogin = (req, res) => {
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
    };

    this.viaSignup = (req, res) => {
        passport.authenticate('local-signup', (err, user) => {
            if (err) {
                return res.status(500).send('Произошла ошибка, попробуйте снова');
            }
            if (!user || user.username == 'current') {
                return res.status(401).send('Пользователь с таким именем уже существует');
            }
            req.logIn(user, err => {
                if (err) {
                    return res.status(500).send('Произошла ошибка, попробуйте снова');
                }
                return res.sendStatus(200);
            })
        })(req, res);
    };

};
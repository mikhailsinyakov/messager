'use strict';

const passport = require('passport');

const serverErrMsg = 'Произошла ошибка, попробуйте снова';
const incorrectInputMsg = 'Неверное имя пользователя или пароль';
const usernameIsTaken = 'Пользователь с таким именем уже существует';


module.exports = function () {

    this.viaLogin = (req, res) => {
        passport.authenticate('local-login', (err, user) => {
            if (err) {
                const status = 'Server error';
                const message = serverErrMsg;
                return res.status(500).send({status, message});
            }
            if (!user) {
                const status = 'Invalid credentials';
                const message = incorrectInputMsg;
                return res.status(401).send({status, message});
            }
            req.logIn(user, err => {
                if (err) {    
                    const status = 'Server error';
                    const message = serverErrMsg;
                    return res.status(500).send({status, message});
                }
                const status = 'Success';
                return res.status(200).send({status});
            })
        })(req, res);
    };

    this.viaSignup = (req, res) => {
        passport.authenticate('local-signup', (err, user) => {
            if (err) {
                const status = 'Server error';
                const message = serverErrMsg;
                return res.status(500).send({status, message});
            }
            if (!user || user.username == 'current') {
                const status = 'Invalid credentials';
                const message = usernameIsTaken;
                return res.status(401).send({status, message});
            }
            req.logIn(user, err => {
                if (err) {
                    const status = 'Server error';
                    const message = serverErrMsg;
                    return res.status(500).send({status, message});
                }
                const status = 'Success';
                return res.status(200).send({status});
            })
        })(req, res);
    };

};
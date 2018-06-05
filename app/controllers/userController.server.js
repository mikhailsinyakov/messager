'use strict';

const Users = require('../models/users');

module.exports = function() {

    this.getUserInfo = (req, res) => {
        let username = req.params.username;
        const onlyUsername = req.query.onlyUsername;

        if (username == 'current') username = req.user ? req.user.username : null;
        if (onlyUsername == 'true') return res.status(200).send({status: 'Success', username});
        if (!username) return res.status(404).send({status: 'Not found'});

        Users.findOne({username}, {_id: false, password: false, __v: false})
                .then(user => {
                    if (user) return res.status(200).send({status: 'Success', user});
                    res.sendStatus(404);
                })
                .catch(err => res.status(500).send({status: 'Server error'}));
    };

    this.changeUserInfo = (req, res) => {
        let username = req.params.username;
        if (username == 'current') username = req.user ? req.user.username : null;
        if (!username) return res.status(404).send({status: 'Not found'});

        const newPropsObj = req.body;

        Users.findOne({username})
                .then(user => {
                    for (const key in newPropsObj) {
                        user[key] = newPropsObj[key];
                    }
                    user.save()
                            .then(() => res.status(200).send({status: 'Success', username}))
                            .catch(err => res.status(500).send({status: 'Server error'}));
                })
                .catch(err => res.status(500).send({status: 'Server error'}));
    };

};
'use strict';

const Dialogs = require('../models/dialogs');
const UserController = require('./userController.server');

const userController = new UserController();

module.exports = function() {

    this.getAllDialogsInfo = (req, res) => {
        const username = req.params.username;
        if (!req.user || req.user.username !== username) {
            return res.status(401).send({status: 'Not authorized'});
        }
        Dialogs.find({$or: [{username1: username}, {username2: username}]})
            .then(dialogs => {
                dialogs = dialogs.map(dialog => {
                    const { username1, username2, messages } = dialog;
                    const penPalUsername = username1 == username ? username2 : username1;
                    let lastMessage = messages[messages.length - 1];
                    const { date, sender, text, read } = lastMessage;
                    lastMessage = { date, sender, text, read };
                    return { penPalUsername, lastMessage };
                });
                res.status(200).send({status: 'Success', dialogs});
            }).catch(err => res.status(500).send({status: 'Network error'}));
    };

    this.getDialogInfo = (req, res) => {
        const username = req.params.username;
        const penPalUsername = req.params.penPalUsername;
        if (!req.user || req.user.username !== username) {
            return res.status(401).send({status: 'Not authorized'});
        }
        Dialogs.findOne({$or: [
            {username1: username,  username2: penPalUsername}, 
            {username1: penPalUsername, username2: username}
        ]}, {messages: true})
            .then(dialog => { 
                if (!dialog) {
                    return res.status(200).send({status: 'Success', messages: []});
                }
                const messages = dialog.messages.map(message => {
                    const { date, sender, text, read } = message;
                    return { date, sender, text, read };
                });

                res.status(200).send({status: 'Success', messages})
            })
            .catch(err => res.status(500).send({status: 'Network error'}));
    };

    this.getNumUnreadMessages = (req, res) => {
        const { username } = req.params;
        if (!req.user || req.user.username !== username) {
            return res.status(401).send({status: 'Unauthorized'});
        }
        Dialogs.find({$or: [{username1: username}, {username2: username}]})
            .then(dialogs => {
                let number = 0;
                dialogs.forEach(dialog => {
                    dialog.messages.forEach(message => {
                        const { sender, read } = message;
                        if (sender != username && !read) number++;
                    });
                });
                res.status(200).send({status: 'Success', number});
            }).catch(err => res.status(500).send({status: 'Network error'}));
    };

    this.addMessage = (username, penPalUsername, text) => {
        return new Promise((resolve, reject) => {
            const promises = [
                userController.userExists(username),
                userController.userExists(penPalUsername)
            ];
            Promise.all(promises)
                .then(result => {
                    if (!result[0] || !result[1]) {
                        return reject('Specified user doesn\'t exist');
                    }
                    Dialogs.findOne({$or: [
                        {username1: username,  username2: penPalUsername}, 
                        {username1: penPalUsername, username2: username}
                    ]}).then(dialog => {
                        const date = new Date();
                        const sender = username;
                        const read = false;
                        if (!dialog) {
                            const newDialog = new Dialogs({
                                username1: username,
                                username2: penPalUsername,
                                messages:[{date, sender, text, read}]
                            });
                            newDialog.save()
                                .then(() => resolve({date, sender, text, read}))
                                .catch(err => reject(err));
                        }
                        else {
                            dialog.messages.push({date, sender, text, read});
                            dialog.save()
                                .then(() => resolve({date, sender, text, read}))
                                .catch(err => reject(err));
                        }
                    })
                }).catch(err => reject(err));
        });
        
    }

    this.changeStatusOfMessage = (username1, username2, index) => {
        return new Promise((resolve, reject) => {
            Dialogs.findOne({$or: [
                {username1: username1,  username2: username2}, 
                {username1: username2, username2: username1}
            ]}).then(dialog => {
                dialog.messages[index].read = true;
                dialog.save()
                    .then(() => resolve())
                    .catch(err => reject(err));
            }).catch(err => reject(err));
        });
    }

    this.removeDialog = (req, res) => {//test
        const username = req.params.username;
        const penPalUsername = req.params.penPalUsername;
        Dialogs.remove({$or: [
            {username1: username,  username2: penPalUsername}, 
            {username1: penPalUsername, username2: username}
        ]}).then(() => res.status(200).send({status: 'Success'}))
        .catch(err => res.status(500).send({status: 'Network error'}));
    }

}
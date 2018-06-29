'use strict';

const Dialogs = require('../models/dialogs');

module.exports = function() {

    this.getAllDialogsInfo = (req, res) => {
        const username = req.params.username;
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

    this.addMessage = (username, penPalUsername, text) => {
        return new Promise((resolve, reject) => {
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
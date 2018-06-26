'use strict';

const mongoose = require('mongoose');

const Dialog = new mongoose.Schema({
    username1: String,
    username2: String,
    messages: [{
        date: Date,
        sender: String,
        text: String,
        read: Boolean
    }]
});

module.exports = mongoose.model('Dialog', Dialog);
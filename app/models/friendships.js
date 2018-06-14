'use strict';

const mongoose = require('mongoose');

const Friendship = new mongoose.Schema({
    user1: {
        username: String,
        state: String
    },
    user2: {
        username: String,
        state: String
    }
});

module.exports = mongoose.model('Frienship', Friendship);
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const sessionSecret = process.env.SESSION_SECRET;

module.exports = function(app, passport) {
    app.use('/public', express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({secret: sessionSecret, resave: false, saveUninitialized: true}));
    app.use(passport.initialize());
    app.use(passport.session());
};
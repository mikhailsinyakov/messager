'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

module.exports = function(app, passport) {
    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({secret: 'messenger', resave: false, saveUninitialized: true}));
    app.use(passport.initialize());
    app.use(passport.session());
};
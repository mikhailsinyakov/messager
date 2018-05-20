'use strict';

const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const passport = require('passport');

const routes = require('./app/routes');
const passportConfig = require('./app/config/passport');
const appConfig = require('./app/config/app');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT;

mongoose.connect(process.env.ATLAS_URI)
        .catch(err => console.error(err));


appConfig(app, passport);
passportConfig(passport);
routes(app);

server.listen(port, () => console.log('Server is listening..'))

'use strict';

const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();

const routes = require('./app/routes');
const passportConfig = require('./app/config/passport');
const appConfig = require('./app/config/app');
const handleWebSocketConnection = require('./app/websocket/server');

const port = process.env.PORT;
const app = express();
const server = http.createServer(app);
handleWebSocketConnection(server);

mongoose.connect(process.env.ATLAS_URI)
        .catch(err => console.error(err));

appConfig(app, passport);
passportConfig(passport);
routes(app);

server.listen(port, () => console.log('Server is listening..'))

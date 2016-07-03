"use strict";

//external dependencies
const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);

//basic middleware

app.use(express.static('public'));
app.use(session({
    store: new FileStore({
        ttl: 20 * 24 * 60 * 60
    }),
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET || 'datBOI',
    cookie: { maxAge: 20 * 24 * 60 * 60 * 1000 }
}));

//main routers

app.use(require('./routers/login.js'));

module.exports = app;

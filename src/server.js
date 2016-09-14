'use strict';

// external dependencies
const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);

app.use(session({
    store: new FileStore({
        ttl: 20 * 24 * 60 * 60,
        path: `${__dirname}/../sessions`,
    }),
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET || 'datBOI',
    cookie: { maxAge: 20 * 24 * 60 * 60 * 1000 },
}));

// main routers

app.use(require('./routers/login.js'));
app.use(require('./routers/homepage.js'));
app.use(require('./routers/browserify-bundle.js'));
app.use('/api/characters', require('./routers/characters.js'));
app.use('/api/nodes', require('./routers/nodes.js'));

app.use(express.static(`${__dirname}/public`));

module.exports = app;

'use strict';

const router = require('express').Router();

let bundleBuf;

router.get('/bundle.js', (req, res) => {
    res.set('Content-type', 'application/javascript');
    res.send(bundleBuf);
});

// create the bundle
const BrowserifyRequired = require('browserify');
const browserify = new BrowserifyRequired({ debug: process.env.NODE_ENV !== 'production' });
browserify.add(`${__dirname}/../scripts/entry.js`);
console.log('BUNDLING INITIATED');
browserify.bundle((err, buf) => {
    if (err) {
        console.log('BUNDLING ERROR');
        throw err;
    }
    console.log('BUNDLING COMPLETED SUCCESSFULLY');
    bundleBuf = buf;
});

module.exports = router;

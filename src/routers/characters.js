'use strict';

const lib = require('./lib/general.js');
const checkLogin = require('./lib/login-checker.js');
const dbInt = require('./lib/db-interface.js');

const router = require('express').Router();

router.get('/get', checkLogin, lib.wrap(async((req, res) => {
    const returnedRows = await(dbInt.characters.get(req.user));
    res.status(200).json(returnedRows);
})));

router.get('/create', checkLogin, lib.wrap(async((req, res) => {
    if (!req.query.name) {
        res.status(400).send('missing name query parameter');
        return;
    }
    const queryName = req.query.name.toString();
    if (queryName.length > 30) {
        res.status(400).send('name query parameter too long');
        return;
    }
    const characterData = await(dbInt.characters.insert(req.user, queryName));
    res.status(200).json(characterData);
})));

module.exports = router;

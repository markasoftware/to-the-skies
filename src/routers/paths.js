'use strict';

const lib = require('./lib/general.js');
const mw = require('./lib/api-middleware.js');
const dbInt = require('./lib/db-interface.js');

const router = require('express').Router();

router.get('/create', mw.checkLogin, mw.checkParams('characterid', 'name'), (req, res) => {
    res.end();
});

router.get('/get-list', mw.checkLogin, lib.wrap(async((req, res) => {
    const dbRes = await(dbInt.paths.getList(req.user));
    res.status(200);
    res.json(dbRes);
})));

module.exports = router;

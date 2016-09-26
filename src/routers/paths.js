'use strict';

const lib = require('./lib/general.js');
const mw = require('./lib/api-middleware.js');
const dbInt = require('./lib/db-interface.js');

const router = require('express').Router();

router.get('/create', mw.checkLogin, mw.checkParams('characterid', 'name'), async((req, res) => {
    const dbRes = await(dbInt.paths.create(req.user, req.query.name, req.query.characterid));
    if (!dbRes) {
        res.status(404);
        res.json('The specified character either does not exist or is not owned by you');
        return;
    }
    res.status(200);
    res.json(dbRes);
}));

router.get('/get-list', mw.checkLogin, lib.wrap(async((req, res) => {
    const dbRes = await(dbInt.paths.getList(req.user));
    res.status(200);
    res.json(dbRes);
})));

module.exports = router;

'use strict';

const lib = require('./lib/general.js');
const mw = require('./lib/api-middleware.js');
const dbInt = require('./lib/db-interface.js');

const router = require('express').Router();

router.get('/create', mw.checkLogin, mw.checkParams('characterid', 'name'), lib.wrap((req, res) => {
    const dbRes = await(dbInt.paths.create(req.user, req.query.name, req.query.characterid));
    if (!dbRes) {
        res.status(404);
        res.json('The specified character either does not exist or is not owned by you');
        return;
    }
    res.status(200);
    res.json(dbRes);
}));

router.get('/delete', mw.checkLogin, mw.checkParams('pathid'), lib.wrap((req, res) => {
    const dbRes = await(dbInt.paths.delete(req.user, req.query.pathid));
    if (dbRes.rowCount === 0) {
        res.status(404);
        res.json('The specified path does not exist or is not owned by you');
        return;
    }
    res.status(200);
    res.json('success');
}));

router.get('/get-list', mw.checkLogin, lib.wrap((req, res) => {
    const dbRes = await(dbInt.paths.getList(req.user));
    res.status(200);
    res.json(dbRes);
}));

router.get('/publish', mw.checkLogin, mw.checkParams('pathid'), lib.wrap((req, res) => {
    const dbRes = await(dbInt.paths.publish(req.user, req.query.pathid));
    if (dbRes.rowCount === 0) {
        res.status(404);
        res.json('The specified path either a) does not exist b) is not owned by you or c) is already published');
        return;
    }
    res.status(200);
    res.json('success');
}));

module.exports = router;

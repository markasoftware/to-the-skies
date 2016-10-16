'use strict';

const router = require('express').Router();
const lib = require('./lib/general.js');
const mw = require('./lib/api-middleware.js');
const dbInt = require('./lib/db-interface.js');

router.get('/nodes/create', mw.checkParams('pathid', 'content', 'options', 'optionid'),
    lib.wrap((req, res) => {
        if (req.query.options.length !== 2) {
            res.status(400);
            res.json('There must be exactly 2 options');
            return;
        }
        let dbRes;
        try {
            dbRes = await(dbInt.pmod.createNode(req.query.pathid, req.query.optionid, req.query.content, req.query.options));
        } catch (e) {
            res.status(404);
            res.send('Invalid stuff occured. Probably your fault.');
        }
        res.status(200);
        res.send(dbRes);
    }
));

router.get('/options/create', mw.checkParams('nodeid', 'content'), lib.wrap((req, res) => {
    const optionid = await(dbInt.pmod.createOption(req.query.pathid, req.query.nodeid, req.query.content));
    // will be false if path not owned by user, etc
    if (!optionid) {
        res.status(404);
        res.json('Node not in path or something');
        return;
    }
    res.status(200);
    res.json({ optionid });
}));

router.get('/connections/create', mw.checkParams('optionid', 'nodeid'), lib.wrap((req, res) => {
    await(dbInt.pmod.createConnection(req.user, req.query.optionid, req.query.nodeid));
    res.sendStatus(200);
}));

module.exports = router;

'use strict';

const lib = require('./lib/general.js');
const dbInt = require('./lib/db-interface.js');
const mw = require('./lib/api-middleware.js');
const cmLogic = require('./logic/character-movement-logic.js');
const router = require('express').Router();

router.get('/get-current', mw.checkLogin, mw.checkParams('characterid'), async((req, res) => {
    const dbRes = await(dbInt.characterMovement.getCurrent(req.query.characterid));
    if (dbRes.length < 1) {
        res.status(404);
        res.json('The character specified does not exist, or the node doesnt exist (?)');
        return;
    }
    const processedRes = cmLogic.processGetCurrentRes(dbRes);
    res.status(200);
    res.json(processedRes);
}));

module.exports = router;

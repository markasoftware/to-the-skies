'use strict';

const lib = require('./lib/general.js');
const dbInt = require('./lib/db-interface.js');
const mw = require('./lib/api-middleware.js');
const router = require('express').Router();

router.get('/get', mw.checkLogin, mw.checkParams('characterid'), (req, res) => {
    let dbRes;
    if (req.query.options) {
        dbRes = dbInt.nodes.getNext(req.query.characterid, req.query.option_index);
    } else {
        dbRes = dbInt.nodes.getCurrent(req.query.characterid);
    }
});

module.exports = router;

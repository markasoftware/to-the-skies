'use strict';

const lib = require('./lib/general.js');
const dbInt = require('./lib/db-interface.js');
const mw = require('./lib/api-middleware.js');
const router = require('express').Router();

router.get('/get', mw.checkLogin, mw.checkParams('characterid'), (req, res) => {
    if (req.query.options) {
        // TODO
    } else {
        const dbRes = dbInt.nodes.getCurrent(req.query.characterid)
    }
});

module.exports = router;

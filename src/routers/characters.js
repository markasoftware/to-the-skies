const lib = require('./lib/general.js');
const apiLib = require('./lib/api-lib.js');
const dbInt = require('./lib/db-interface.js');

const router = require('express').Router();

router.get('/get', lib.handle500(async((req, res, next) => {
    if(apiLib.checkLogin(req, res)) return;
    const returnedRows = await(dbInt.characters.get(req.user));
    res.status(200).json(returnedRows);
})));

router.get('/create', lib.handle500(async((req, res, next) => {
    if(apiLib.checkLogin(req, res)) return;
    if(!req.query.name) {
        res.status(400).send('missing name query parameter');
        return;
    }
    const characterid = await(dbInt.characters.insert(req.user, req.query.name));
    res.status(200).json(characterid);
})));

module.exports = router;

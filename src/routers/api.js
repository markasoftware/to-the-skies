'use strict';

const router = require('express').Router();
const mw = require('./lib/api-middleware.js');
const dbInt = require('./lib/db-interface.js');
const lib = require('./lib/general.js');

router.use('/characters', require('./characters.js'));
router.use('/paths', require('./paths.js'));
router.use('/pmod', mw.checkParams('pathid'), mw.checkPathOwned, require('./path-modification.js'));

module.exports = router;

'use strict';

const lib = require('./general.js');
const dbInt = require('./db-interface.js');

module.exports.checkLogin = (req, res, next) => {
    if (!req.user) {
        res.status(401).json('not logged in');
    } else next();
};

module.exports.checkParams = (...checkFor) =>
    (req, res, next) => {
        let missingParameterFound = false;
        for (let k = 0; k < checkFor.length; ++k) {
            if (Object.keys(req.query).indexOf(checkFor[k]) === -1) {
                res.status('400');
                res.json(`missing ${checkFor[k]} query parameter`);
                missingParameterFound = true;
                break;
            }
        }
        if (!missingParameterFound) next();
    };

module.exports.checkPathOwned = lib.wrap((req, res, next) => {
    const pathCount = await(dbInt.paths.checkIfExistsAndOwned(req.user, req.query.pathid));
    if (pathCount === 1) {
        next();
        return;
    }
    if (pathCount === 0) {
        res.status(404);
        res.json('The specified path either does not exist, is owned by somebody else, or is published');
        return;
    }
    throw new Error('Serious fuckup detected! Multiple paths with the same id??');
});

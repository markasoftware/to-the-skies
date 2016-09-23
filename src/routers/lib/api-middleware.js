'use strict';

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

'use strict';

module.exports.checkLogin = (req, res, next) => {
    if (!req.user) {
        res.status(401).json('not logged in');
    } else next();
};

module.exports.checkParams = (checkFor) =>
    (req, res, next) => {
        let missingParameterFound = false;
        let realCheckFor;
        if (checkFor.forEach) realCheckFor = checkFor;
        else realCheckFor = [checkFor];
        for (let k = 0; k < realCheckFor.length; ++k) {
            if (Object.keys(req.query).indexOf(realCheckFor[k]) === -1) {
                res.status('400');
                res.json(`missing ${realCheckFor[k]} query parameter`);
                missingParameterFound = true;
                break;
            }
        }
        if (!missingParameterFound) next();
    };

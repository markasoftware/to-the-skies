'use strict';

module.exports = (req, res, next) => {
    if (!req.user) {
        res.status(401).json('not logged in');
    } else next();
};

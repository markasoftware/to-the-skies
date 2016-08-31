'use strict';

// general functions used in various places

global.async = require('asyncawait/async');
global.await = require('asyncawait/await');

const util = require('util');

module.exports.wrap = (fn) =>
    async((req, res, next) => {
        try {
            await(fn(req, res, next));
        } catch (e) {
            next(e);
        }
    });

module.exports.inspect = util.inspect;

//general functions used in various places

global.async = require('asyncawait/async');
global.await = require('asyncawait/await');

module.exports.wrap = (fn) => {
    return async((req, res, next) => {
        try {
            await(fn(req, res, next));
        } catch (e) {
            next(e)
        }
    });
}

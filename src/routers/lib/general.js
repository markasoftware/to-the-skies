//general functions used in various places

global.async = require('asyncawait/async');
global.await = require('asyncawait/await');

module.exports.handle500 = (handler) => {
    return async((req, res, next) => {
        try {
            await(handler(req, res, next));
        } catch (e) {
            if(!res.headersSent) {
                res.status(500);
            }
            if(process.env.NODE_ENV === 'production') {
                res.send('Internal Server Error. This may or may not be your fault');
            } else {
                res.send(`Internal server error: ${e}`);
                console.error(e);
            }
        }
    });
}

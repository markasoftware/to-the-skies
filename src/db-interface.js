"use strict";

const pg = require('pg');

const conString = 'postgres://' + (process.env.DB_USER || 'postgres') + ':' + (process.env.DB_PASS || 'password') + '@' + (process.env.DB_HOST || 'localhost') + '/' + (process.env.DB_NAME || 'to_the_skies_dev');

const DBConnect = (cb) => {
    pg.connect(conString, (err, client, done) => {
        if (err) throw 'DB Connection error: ' + err;
        else cb(client, done);
    });
}

const loginOrCreate = (userID, cb) => {
    pg.connect(conString, function(err, client, done) {
        if(err) throw 'DB Connection Error in loginOrCreate: ' + err
    });
};

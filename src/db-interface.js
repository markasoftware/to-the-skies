"use strict";

const pgp = require('pg-promise')();
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const inspect = require('util').inspect;

const conConfig = {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'password',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'to_the_skies_dev'
}

const db = pgp(conConfig);

module.exports.login = async((googleID) => {
    return new Promise((resolve, reject) => {
        let row;
        try {
            row = await(db.one('INSERT INTO users (googleid) VALUES ($1) ON CONFLICT DO NOTHING RETURNING userid', [googleID]));
        }
        catch (err) {
            return reject(new Error('query error: ' + err));
        }
        if(typeof row.userid !== 'number') {
            return reject(new Error('userid was not number: ' + inspect(row)));
        }
        resolve(row.userid);
    });
});

module.exports.terminateConnections = () => { pgp.end(); };

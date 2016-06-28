"use strict";

const pgp = require('pg-promise')();
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const inspect = require('util').inspect;

const conConfig = {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    database: process.env.DB_NAME || 'to_the_skies_dev'
}

const db = pgp(conConfig);

module.exports.login = async((googleID) => {
    return new Promise((resolve, reject) => {
        let row;
        try {
            //i dont know how this works. Hopefully pg 9.5 support will be added to semaphore before it matters
            row = await(db.one('INSERT INTO users (googleid) SELECT ($1) WHERE NOT EXISTS (SELECT * FROM USERS WHERE googleid=$1); SELECT userid FROM users WHERE googleid=$1', [googleID]));
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

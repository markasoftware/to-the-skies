"use strict";

const pgp = require('pg-promise')();
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const inspect = require('util').inspect;

const conConfig = {
    user: process.env.DB_USER || 'to_the_skies',
    password: process.env.DB_PASS || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    database: process.env.DB_NAME || 'to_the_skies_dev'
}

const db = pgp(conConfig);

module.exports.login = async((googleID) => {
    if(typeof googleID !== 'string' || googleID.length !== 21)
        throw 'invalid google ID';
    let row;
    try {
        row = await(db.one('INSERT INTO users (googleid) VALUES ($1) ON CONFLICT DO NOTHING; SELECT userid FROM users WHERE googleid = $1', [googleID]));
    }
    catch (err) {
        throw 'query error: ' + err;
    }
    if(typeof row.userid !== 'number') {
        throw 'userid was not number: ' + inspect(row);
    }
    return row.userid;
});

module.exports.characters = {
    get: async((userid) => {
        let rows;
        try {
            rows = await(db.query(
                "SELECT name, position, characterid FROM characters WHERE userid = $1",
                [userid]
            ));
        } catch (e) {
            throw 'Query Error: ' + e;
        }
        return rows;
    }),
    insert: async((userid, name) => {
        const maxPosQueryRes = await(db.oneOrNone(
            "SELECT MAX(position) FROM characters WHERE userid = $1",
            [userid]
        ));
        const nextPos = typeof maxPosQueryRes.max == 'number' ?
            maxPosQueryRes.max + 1 :
            0;
        const charID = await(db.one(
            "INSERT INTO characters (userid, name, position) VALUES ($1, $2, $3) RETURNING characterid;",
            [userid, name, nextPos]
        )).characterid;
        return charID;
    })
}    


module.exports.terminateConnections = () => { pgp.end(); };

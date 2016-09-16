'use strict';

const pgp = require('pg-promise')();
const lib = require('./general.js');

const conConfig = {
    user: process.env.DB_USER || 'to_the_skies',
    password: process.env.DB_PASS || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    database: process.env.DB_NAME || 'to_the_skies_dev',
};

const db = pgp(conConfig);

module.exports.login = async((googleID) => {
    if (typeof googleID !== 'string' || googleID.length !== 21) {
        throw Error('invalid google ID');
    }
    let row;
    try {
        row = await(db.one(
            `INSERT INTO users (googleid) VALUES ($1) ON CONFLICT DO NOTHING;
            SELECT userid FROM users WHERE googleid = $1`,
        [googleID]));
    } catch (err) {
        throw Error(`query error: ${err}`);
    }
    if (typeof row.userid !== 'number') {
        throw Error(`userid was not number: ${lib.inspect(row)}`);
    }
    return row.userid;
});

module.exports.characters = {
    get: async((userid) => {
        let rows;
        try {
            rows = await(db.query(
                'SELECT name, position, characterid FROM characters WHERE userid = $1',
                [userid]
            ));
        } catch (e) {
            throw Error(`Query Error: ${e}`);
        }
        return rows;
    }),
    insert: async((userid, name) => {
        const maxPosQueryRes = await(db.oneOrNone(
            'SELECT MAX(position) FROM characters WHERE userid = $1',
            [userid]
        ));
        const nextPos = typeof maxPosQueryRes.max === 'number' ?
            maxPosQueryRes.max + 1 :
            0;
        const idAndPosition = await(db.one(
            `INSERT INTO characters (userid, name, position)
            VALUES ($1, $2, $3)
            RETURNING characterid, position;`,
            [userid, name, nextPos]
        ));
        return {
            characterid: idAndPosition.characterid,
            position: idAndPosition.position,
            name,
        };
    }),
    delete: async((userid, characterid) => {
        const queryRes = await(db.result(
            'DELETE FROM characters WHERE userid = $1 AND characterid = $2',
            [userid, characterid]
        ));
        // just in case
        if (queryRes.rowCount > 1) {
            console.error('SERIOUS FUCKUP DETECTED!');
            throw new Error('SERIOUS FUCKUP MULTIPLE ROWS DELETED');
        }
        return queryRes.rowCount === 1;
    }),
};

module.exports.characterMovement = {
    getCurrent: async((characterid) =>
         await(db.query(`
             SELECT nodes.node_content, options.option_content, options.optionid
             FROM nodes JOIN options USING (nodeid)
             WHERE nodeid IN (
                SELECT nodeid FROM characters WHERE characterid = $1
             );
             `,
             [characterid]
        ))
    ),
    getNextOptions: async((characterid, optionid) => {
    }),
    moveToNext: async((characterid, nodeid) => {
    }),
};

module.exports.terminateConnections = () => { pgp.end(); };

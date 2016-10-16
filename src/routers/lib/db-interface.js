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

module.exports.tx = db.tx;

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
    getCurrent: (characterid) =>
         db.query(`
             SELECT nodes.content AS node_content, options.optionid, options.content AS option_content
             FROM nodes JOIN options USING (nodeid)
             WHERE nodeid IN (
                SELECT nodeid FROM characters WHERE characterid = $1
             )
             `,
             [characterid]
        ),
    getNextOptions: async((characterid, optionid) => {
    }),
    moveToNext: async((characterid, nodeid) => {
    }),
};

module.exports.paths = {
    checkIfExistsAndOwned: async((userid, pathid) => {
        const res = await(db.one(`
            SELECT COUNT(*)
            FROM paths
            WHERE pathid = $2
            AND userid = $1
            AND published = false
            `,
            [userid, pathid]
        ));
        return Number(res.count);
    }),
    create: async((userid, name, characterid) => {
        let newPathid;
        try {
            await(db.tx(async(t => {
                newPathid = await(t.one(`
                    INSERT INTO paths
                    (userid, name) VALUES ($1, $2)
                    RETURNING pathid
                    `,
                    [userid, name]
                )).pathid;
                const oldPathid = await(t.one(`
                    SELECT pathid
                    FROM characters JOIN nodes USING (nodeid)
                    WHERE characters.characterid = $2
                    AND characters.userid = $1
                    `,
                    [userid, characterid]
                )).pathid;
                const oldPathNodes = await(t.query(`
                    SELECT nodeid
                    FROM nodes
                    WHERE pathid = $1
                    `,
                    [oldPathid]
                ));
                oldPathNodes.forEach((cur) => {
                    await(t.none(`
                        INSERT INTO node_coordinates
                        (pathid, nodeid, xpos, ypos) VALUES ($1, $2, 0, 0)
                        `,
                        [newPathid, cur.nodeid]
                    ));
                });
            })));
        } catch (e) {
            return false;
        }
        return {
            pathid: newPathid,
        };
    }),
    delete: (userid, pathid) =>
        db.result(`
            DELETE FROM paths
            WHERE userid = $1
            AND pathid = $2
            AND published = false
            `,
            [userid, pathid]
        ),
    getList: (userid) =>
        db.query(`
            SELECT pathid, name
            FROM paths
            WHERE userid = $1
            `,
            [userid]
        ),
    publish: (userid, pathid) =>
        db.result(`
            UPDATE paths
            SET published = true
            WHERE userid = $1
            AND pathid = $2
            AND published = false
            `,
            [userid, pathid]
        ),
};

module.exports.pmod = {
    // unfortunately there is some stuff here which I
    // normally wouldn't want to put into the database
    // layer, but because of transactions that's
    // how we're going to do it
    createNode: (pathid, optionid, content, options) =>
        db.tx(async(t => {
            /*
            Here's what we have to do:
            Insert the node into the nodes table
            Insert the node into the node_coordinates table
            Create both options
            Create the opening connection to the new node
            */
            const toReturn = { optionids: [] };
            toReturn.nodeid = await(t.one(`
                INSERT INTO nodes
                (pathid, content)
                VALUES ($1, $2)
                RETURNING nodeid
                `,
                [pathid, content]
            )).nodeid;
            await(t.none(`
                INSERT INTO node_coordinates
                (pathid, nodeid, xpos, ypos)
                VALUES ($1, $2, $3, $4)
                `,
                [pathid, toReturn.nodeid, 0, 0]
            ));
            toReturn.optionids[0] = await(module.exports.pmod.createOption(
                pathid, toReturn.nodeid, options[0], t
            ));
            toReturn.optionids[1] = await(module.exports.pmod.createOption(
                pathid, toReturn.nodeid, options[1], t
            ));
            await(module.exports.pmod.createConnection(
                pathid, optionid, toReturn.nodeid, t
            ));

            return toReturn;
        })),

    createOption: async((pathid, nodeid, content, t = db) => {
        // make sure the node is in the given path, and by extension
        // verify that it is owned by the correct user
        const verifyRes = await(t.oneOrNone(`
            SELECT 1
            FROM nodes
            WHERE pathid = $1
            AND nodeid = $2
            LIMIT 1
            `,
            [pathid, nodeid]
        ));
        if (!verifyRes) {
            throw new Error('option not owned by node or not in path or something');
        }
        return await(t.oneOrNone(`
            INSERT INTO options
            (nodeid, content)
            VALUES ($1, $2)
            RETURNING optionid
            `,
            [nodeid, content]
        )).optionid;
    }),

    createConnection: async((pathid, optionid, nodeid, t = db) => {
        // verify that the option is on a node in the current path
        // does NOT need to be owned by current user
        const optionVerifyRes = await(t.oneOrNone(`
            SELECT 1
            FROM options
            JOIN nodes USING (nodeid)
            JOIN node_coordinates USING (nodeid)
            WHERE node_coordinates.pathid = $1 AND optionid = $2
            LIMIT 1
            `,
            [pathid, optionid]
        ));
        if (!optionVerifyRes) {
            console.log('option verify fail');
            throw new Error('option verification failed');
        }
        // verify that the node is owned by the current path
        const nodeVerifyRes = await(t.one(`
            SELECT 1
            FROM nodes
            WHERE pathid = $1 AND nodeid = $2
            LIMIT 1
            `,
            [pathid, nodeid]
        ));
        if (!nodeVerifyRes) {
            console.log('node verify fail');
            throw new Error('node verification failed');
        }
        // insert the connection
        const mainRes = await(t.none(`
            INSERT INTO connections
            (optionid, nodeid)
            VALUES ($1, $2)
            `,
            [optionid, nodeid]
        ));
    }),
};

module.exports.terminateConnections = () => { pgp.end(); };

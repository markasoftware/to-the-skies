const supertest = require('supertest');
const rewire = require('rewire');
const assert = require('chai').assert;
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const urls = require('./urls.js');
const dbIntUrl = urls.dbInt;

const lib = require('./lib.js');

//database connection stuff
process.env.DB_NAME = 'to_the_skies_test';

//reset the database to the templatee

describe('database', () => {

    let dbInt = rewire(dbIntUrl);

    before(lib.resetDB);

    afterEach(dbInt.terminateConnections);

    it('should be able to connect to the database', async(() => {
        const row = await(dbInt.__get__('db').one('SELECT COUNT(*) FROM nodes;'));
        assert.isAbove(row.count, 0, 'there should be at least 1 node in the nodes table');
        const row2 = await(dbInt.__get__('db').one('SELECT current_database();'));
        assert.equal(row2.current_database, 'to_the_skies_test', 'current database name');
    }));
    describe('login', () => {
        
        before(lib.resetDB);

        let lastUserID;

        it('should be able to insert new users', async(() => {
            //try to login with a new username
            const returnedUserID = await(dbInt.login('133769690000000000000'));
            const row = await(dbInt.__get__('db').one('SELECT * FROM users WHERE googleid=\'133769690000000000000\''));
            assert.equal(row.userid, returnedUserID, 'returned user ID and selected user ID should be the same');
            //better safe than sorry, rite?
            assert.equal(row.googleid, '133769690000000000000', 'googleid is correct');
            lastUserID = returnedUserID;
        }));
        it('should return the same user id the second time', async(() => {
            //same googleid as last time
            const row = await(dbInt.__get__('db').one('SELECT userid FROM users WHERE googleid=\'133769690000000000000\''));
            assert.equal(row.userid, lastUserID);
        }));
        it('should not allow weird-ass google ids', async(() => {
            try {
                await(dbInt.login('ad,.clgdhpgcdbkcgxbegclu,.cgxbpcgd,.pucgloebcugd,.cgypd'));
            } catch (err) {
                assert.isOk(err);
                return;
            }
            //if we get here there was no error
            assert.fail(0, 1, 'query should throw an error');
        }));
    });
});

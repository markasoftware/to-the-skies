const supertest = require('supertest');
const rewire = require('rewire');
const assert = require('chai').assert;
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const urls = require('./urls.js');

const lib = require('./lib.js');

//reset the database to the templatee

describe('database', () => {

    let dbInt = rewire(urls.dbInt);
    const db = dbInt.__get__('db');

    before(lib.resetDB);

    afterEach(dbInt.terminateConnections);

    it('should be able to connect to the database', async(() => {
        const row = await(dbInt.__get__('db').one('SELECT COUNT(*) FROM nodes;'));
        assert.isOk(row.count, 'should have a result in the row');
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
            const returnedUserID = await(dbInt.login('133769690000000000000'));
            assert.equal(returnedUserID, lastUserID);
        }));

        it('should not allow long google ids', async(() => {
            try {
                await(dbInt.login('ad,.clgdhpgcdbkcgxbegclu,.cgxbpcgd,.pucgloebcugd,.cgypd'));
            } catch (err) {
                assert.isOk(err);
                return;
            }
            assert.fail(0, 1, 'didn\'t throw error');
        }));
        
        it('should not allow short google ids', async(() => {
            try {
                await(dbInt.login('hcroedu'));
            } catch (err) {
                assert.isOk(err);
                return;
            }
            assert.fail(0, 1, 'didn\'t throw error');
        }));

        it('should not allow blank google ids', async(() => {
            try {
                await(dbInt.login());
            } catch (err) {
                assert.isOk(err);
                return;
            }
            assert.fail(0, 1, 'didn\'t throw error');
        }));

        it('should not allow non-string google ids', async(() => {
            //21 terms long, so length will make it think it's valid
            try {
                await(dbInt.login([1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1]));
            } catch (err) {
                assert.isOk(err);
                return;
            }
            assert.fail(0, 1, 'didn\'t throw error');
        }));
    });
});

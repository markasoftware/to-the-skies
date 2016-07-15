'use strict';

const supertest = require('supertest-as-promised')(Promise);
const assert = require('chai').assert;
const rewire = require('rewire');

const urls = require('./urls.js');
const lib = require('./lib.js');
const db = lib.db;
let server;

//we can't test login all that well without a live google API key and all, so these tests may be lacking
//If you are making changes to the login system, be sure to manually test the login thorugh Google thoroughly
describe('Login integration', () => {
    beforeEach(() => {
        lib.unCache(urls.server);
        server = require(urls.server);
    });
    before(lib.resetDB);
    describe('login', () => {

        it('should work with basic login', async(() => {
            const agent = supertest.agent(server);
            //the asserts in login should deal with this
            await(lib.login(agent,'098765432109876543210'));
        }));

        it('should insert into the database when logging in', async(() => {
            await(db.none('SELECT * FROM users WHERE googleid = \'123456789012345678901\''));
            const maxUserId = await(db.one('SELECT MAX(userid) FROM users')).max;
            const agent = supertest.agent(server);
            await(lib.login(agent, '123456789012345678901'));
            const row = await(db.one('SELECT * FROM users WHERE googleid = \'123456789012345678901\''));
            assert.equal(row.googleid, '123456789012345678901');
            assert.isAbove(row.userid, maxUserId);
        }));

        it('should not insert new lines for existing users', async(() => {
            const numRows = await(db.one('SELECT COUNT(*) FROM users')).count;
            const agent = supertest.agent(server);
            await(lib.login(agent, '123456789012345678901'));
            const newNumRows = await(db.one('SELECT COUNT(*) FROM users')).count;
            assert.equal(numRows, newNumRows, 'should have equal number of rows before and after');
        }));

        it('should put the correct userid into the session', async(() => {
            const rewiredServer = rewire(urls.server);
            function getUserID(req, res) {
                res.send(req.user.toString()).end();
            }
            rewiredServer.__get__('app').get('/getuseridtest', getUserID);
            const agent = supertest.agent(rewiredServer);
            await(lib.login(agent, '111111111122222222223'));
            const returnedID = await(agent.get('/getuseridtest').expect(200)).text;
            const dbID = await(db.one('SELECT userid FROM users WHERE googleid=$1', ['111111111122222222223'])).userid;
            assert.isOk(returnedID);
            assert.isOk(dbID);
            assert.equal(dbID, returnedID);
        }));
    });
});

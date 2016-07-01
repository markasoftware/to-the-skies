'use strict';

const supertest = require('supertest');
const assert = require('chai').assert;
const rewire = require('rewire');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const urls = require('./urls.js');
const lib = require('./lib.js');
const db = rewire(urls.dbInt).__get__('db');
const loginRouter = require(urls.server);

//we can't test login all that well without a live google API key and all, so these tests may be lacking
//If you are making changes to the login system, be sure to manually test the login thorugh Google thoroughly
describe('Login integration', () => {
    before(lib.resetDB);
    describe('login', () => {

        function login(agent, id) {
            return new Promise((resolve, reject) => {
                agent
                    .get('/auth/google/callback?id=' + id)
                    .expect('set-cookie', /^connect\.sid=s.{20,}/)
                    .expect(302, (err, res) => { if (err) reject(err); else resolve(res)});
            });
        }

        it('should work with basic login', async(() => {
            const agent = supertest.agent(loginRouter);
            await(login(agent,'098765432109876543210'));
        }));

        it('should insert into the database when logging in', async(() => {
            await(db.none('SELECT * FROM users WHERE googleid = \'123456789012345678901\''));
            const maxUserId = await(db.one('SELECT MAX(userid) FROM users')).max;
            const agent = supertest.agent(loginRouter);
            await(login(agent, '123456789012345678901'));
            const row = await(db.one('SELECT * FROM users WHERE googleid = \'123456789012345678901\''));
            assert.equal(row.googleid, '123456789012345678901');
            assert.isAbove(row.userid, maxUserId);
        }));
    });
});

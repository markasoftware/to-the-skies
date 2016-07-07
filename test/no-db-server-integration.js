const supertest = require('supertest-as-promised')(Promise);
const assert = require('chai').assert;
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const urls = require('./urls.js');
const lib = require('./lib.js');

describe('No DB Server Side Integration', () => {
    describe('User API', () => {

        let server;

        beforeEach(() => {
            lib.unCache(urls.server);
            server = require(urls.server);
        });

        it('should return false when not logged in', async(() => {
            const agent = supertest.agent(server);
            const res = await(agent.get('/api/user'));
            assert.equal(res.text, 'false');
        }));
        it('should return true when logged in', async(() => {
            const agent = supertest.agent(server);
            await(lib.login(agent, '111111111122222222223'));
            const res = await(agent.get('/api/user'));
            assert.equal(res.text, 'true');
        }));
    });
});

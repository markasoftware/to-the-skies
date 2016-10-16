'use strict';

/*
    The difference between this and path-modification-get.js is that
    this one tests things like failing without login, failing when path
    is owned by somebody else, etc. path-modification-get actually checks
    whether they worked properly or not
*/

const lib = require('../lib/lib.js');
const urls = require('../lib/urls.js');
const helpers = require('../lib/api-helpers.js');

const supertest = require('supertest-as-promised');
const m = require('mithril');

describe('Path modification', () => {
    let agent;
    let userID;

    beforeEach(() => {
        agent = supertest.agent(require(urls.server));
        userID = lib.getRandID();
    });

    before(lib.resetDB);

    describe('basic get', () => {
        const baseUrl = '/api/paths/get';

        it('should give 401 when not logged in', helpers.checkLogin(baseUrl));
        it('should give 400 without pathid parameters', async(() => {
            await(lib.login(agent, userID));
            const res = await(agent.get(baseUrl));
            assert.equal(res.status, 400);
        }));
        it('should give 404 if path does not exist', async(() => {
            await(lib.login(agent, userID));
            const res = await(agent.get(`${baseUrl}?pathid=89998`));
            assert.equal(res.status, 404);
        }));
        it('should give 404 if path is owned by another player', async(() => {
            await(lib.login(agent, userID));
            // test against default path
            const res = await(agent.get(`${baseUrl}?pathid=1`));
            assert.equal(res.status, 404);
        }));
        it('should give 404 if the path is published', async(() => {
            await(lib.login(agent, userID));
            const pathid = await(helpers.createCharAndPath(agent));
            await(helpers.publishPath(agent, pathid));
            const res = await(agent.get(`${baseUrl}?pathid=${pathid}`));
            assert.equal(res.status, 404);
        }));
    });

    describe('create node', () => {
        const baseUrl = '/api/pmod/nodes/create';

        function genOpts(pathid, optionid, content, options) {
            // lets use mithril. Because y not
            return `${baseUrl}?${m.route.buildQueryString({
                pathid,
                optionid,
                content,
                options,
            })}`;
        }

        it('should give 401 when not logged in', helpers.checkLogin(baseUrl));
        describe('parameters', () => {
            it('should fail without all required params', async(() => {
                await(lib.login(agent, userID));
                const pathid = await(helpers.createCharAndPath(agent));
                const res = await(agent.get(genOpts(pathid, 234, 'htrhtrhtr', null, ['hrhr', 'hrhr'])));
                // good enough
                assert.equal(res.status, 400);
            }));
            it('should fail if there are not exactly two options', async(() => {
                await(lib.login(agent, userID));
                const pathid = await(helpers.createCharAndPath(agent));
                const res1 = await(agent.get(genOpts(pathid, 123, 'hhh', ['blup', 'htn', 'hl'])));
                const res2 = await(agent.get(genOpts(pathid, 555, 'htrl', ['blap'])));
                assert.equal(res1.status, 400);
                assert.equal(res2.status, 400);
            }));
            it('should fail if things are not the right data type', async(() => {
                // the main thing we're trying to test here is that
                // everything's in a transaction, so just doing the
                // option stuff should be enough
                await(lib.login(agent, userID));
                const pathid = await(helpers.createCharAndPath(agent));
                const res = await(agent.get(genOpts(pathid, 897, 'htrhtrhtr', [123, { hello: 'there' }])));
                assert.equal(res.status, 500);
            }));
        });
        it('should give 404 when the path does not exist', async(() => {
            await(lib.login(agent, userID));
            const dummyOpts = genOpts(222, 333, 'hhh', ['rth', 'lll']);
            const res = await(agent.get(dummyOpts));
            assert.equal(res.status, 404);
        }));
        it('should give 404 when the option does not exist', async(() => {
            await(lib.login(agent, userID));
            // test against default path
            // sometimes, option 3 will exist, making the test even better! yay!
            const opts = genOpts(1, 3, 'hcrhtrhtr', ['bhtnbhtlbhtl', 'idhcrhcih']);
            const res = await(agent.get(opts));
            assert.equal(res.status, 404);
        }));
        it('should give 404 when the path is owned by a different user', async(() => {
            // we'll test against the default path
            await(lib.login(agent, userID));
            const opts = genOpts(1, 1, 'dgcrdgcrdgcrdgcr', ['htshtsn', 'htshtsn']);
            const res = await(agent.get(opts));
            assert.equal(res.status, 404);
        }));
        it('should give 404 when the path is published', async(() => {
            // this test will probably fail once the publish system
            // starts rejecting things without any nodes. Whatever.
            await(lib.login(agent, userID));
            const pathid = await(helpers.createCharAndPath(agent));
            await(helpers.publishPath(agent, pathid));
            const opts = genOpts(pathid, 1, 'dgcrdgcr', ['bbb', 'rrr']);
            const res = await(agent.get(opts));
            assert.equal(res.status, 404);
        }));
        it('should give 200, nodeid, and option ids when valid', async(() => {
            await(lib.login(agent, userID));
            const pathid = await(helpers.createCharAndPath(agent));
            const opts = genOpts(pathid, 1, 'iamanode', ['iamopt1', 'iamopt2']);
            const res = await(agent.get(opts));
            assert.equal(res.status, 200);
            const parsedRes = JSON.parse(res.text);
            assert.isNumber(parsedRes.nodeid);
            assert.isArray(parsedRes.optionids);
            assert.equal(parsedRes.optionids.length, 2);
            assert.isNumber(parsedRes.optionids[0]);
            assert.isNumber(parsedRes.optionids[1]);
        }));
        it('should give 404 when the option is owned by another user', async(() => {
            await(lib.login(agent, userID));
            const pathid1 = await(helpers.createCharAndPath(agent));
            const
        }));
        // that was more tests than i thought there would be
    });
});

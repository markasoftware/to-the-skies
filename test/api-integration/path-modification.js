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

    describe('path verification stuff', () => {
        // this stuff makes sure that the /pmod middleware works right
        // we arguably should be testing this on all /pmod endpoints,
        // but this should be good enough

        beforeEach(() =>
            lib.login(agent, userID)
        );

        it('should give 400 if there is no pathid parameter', async(() => {
        }));
        it('should give 404 if path does not exist', async(() => {
            const res = await(agent.get(`${urls.basePmodGet}?pathid=89998`));
            assert.equal(res.status, 404);
        }));
        it('should give 404 if path is owned by another player', async(() => {
            // test against default path
            const res = await(agent.get(`${urls.basePmodGet}?pathid=1`));
            assert.equal(res.status, 404);
        }));
        it('should give 404 if the path is published', async(() => {
            const pathid = await(helpers.createCharAndPath(agent));
            await(helpers.publishPath(agent, pathid));
            const res = await(agent.get(`${urls.basePmodGet}?pathid=${pathid}`));
            assert.equal(res.status, 404);
        }));
    });
    // that was more tests than i thought there would be
});

'use strict';

const lib = require('../lib/lib.js');
const urls = require('../lib/urls.js');
const helpers = require('../lib/api-helpers.js');
const m = require('mithril');

const supertest = require('supertest-as-promised');

const genCreateOpts = (pathid, optionid, content, options) =>
    `/api/pmod/nodes/create?${m.route.buildQueryString({
        pathid,
        optionid,
        content,
        options,
    })}`;

describe('path modification get', () => {
    let agent;
    let userID;

    beforeEach(() => {
        agent = supertest.agent(require(urls.server));
        userID = lib.getRandID();
    });

    it('should return empty for a new path', async(() => {
        lib.login(agent, userID);
        const pathid = await(helpers.createCharAndPath(agent));
        const res = await(agent.get(`${baseUrl}?pathid=${pathid}`));
        assert.equal(res.status, 200);
        const parsedRes = JSON.parse(res.text);
        assert.deepEqual(parsedRes, {
            nodes: [{
                content: 'The ship floats upwards, to the skies',
                nodeid: 1,
                options: [
                    'This is option 1',
                    'This is option 2',
                ],
            }],
            connections: [],
        });
    }));
    describe('with create', () => {
        it('should work with a couple created nodes', async(() => {
            lib.login(agent, userID);
            const pathid = await(helpers.createCharAndPath(agent));
        }));
    });
});

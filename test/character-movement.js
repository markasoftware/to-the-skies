'use strict';

const lib = require('./lib.js');
const urls = require('./urls.js');
const supertest = require('supertest-as-promised');

describe('Character movement API', () => {
    before(lib.resetDB);

    const server = require(urls.server);
    let agent;
    let userID;

    beforeEach(() => {
        agent = supertest.agent(server);
        userID = lib.getRandID();
    });

    describe('nodes only', () => {
        it('should give 401 when not logged in', async(() => {
            const res = await(agent.get('/api/nodes/get?characterid=221'));
            assert.equal(res.status, 401);
        }));
        it('should give 404 for non-existing character', async(() => {
            await(lib.login(agent, userID));
            const res = await(agent.get('/api/nodes/get?characterid=2892347'));
            assert.equal(res.status, 404);
        }));
        it('should give 400 without characterid parameter', async(() => {
            await(lib.login(agent, userID));
            const res = await(agent.get('/api/nodes/get'));
            assert.equal(res.status, 400);
        }));
    });
    describe('nodes and characters', () => {
        it('should return the first node for a new character', async(() => {
            await(lib.login(agent, userID));
            const createdID = lib.getCreatedID(await(agent.get(
                '/api/characters/create?name=boopyoop'
            )));
            const res = await(agent.get(`/api/nodes/get?characterid=${createdID}`));
            assert.equal(res.status, 200);
            const parsedRes = JSON.parse(res);
            assert.equal(parsedRes.text, 'the ship floats upwards, to the skies.');
            assert.isArray(parsedRes.options, 'options should be array');
            assert.equal(parsedRes.options.length, 2, 'should be 2 options');
            assert.equal(parsedRes.options[0].text, 'This is option 1');
            assert.equal(parsedRes.options[0].optionid, 1);
            assert.equal(parsedRes.options[1].text, 'This is option 2');
            assert.equal(parsedRes.options[1].optionid, 2);
        }));
        it('should say end-nonfinal if there are no more nodes', async(() => {
            await(lib.login(agent, userID));
            const createdID = await(lib.createCharacter(agent));
            const res = await(agent.get(`/api/nodes/get?characterid=${createdID}&optionid=1`));
            assert.equal(res.status, 200);
            const parsedRes = JSON.parse(res);
            assert.equal(parsedRes, 'end-nonfinal');
        }));
        it('should create a new node properly', async(() => {
            // logging into the default user
            await(lib.login(agent, '000000000000000000000'));
            const res = await(agent.get(
                '/api/characters/create?pathid=1&text=Y+tho&options=opt1&options=opt2'
            ));
            assert.equal(res.status, 200);
            const parsedRes = JSON.parse(res);
            assert.isNumber(parsedRes.nodeid);
            // TODO
        }));
    });
});

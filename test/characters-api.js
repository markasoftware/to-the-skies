'use strict';
const supertest = require('supertest-as-promised');
const chance = require('chance')();

const lib = require('./lib.js');
const urls = require('./urls.js');

const server = require(urls.server);

describe('Character API', () => {
    let agent;
    let userID;

    beforeEach(() => {
        agent = supertest.agent(server);
        userID = lib.getRandID();
    });

    before(lib.resetDB);

    describe('get', () => {
        it('should give a 401 when not logged in', async(() => {
            const res = await(agent.get('/api/characters/get'));
            assert.equal(res.status, 401, 'status was not 401');
        }));
        it('should return an empty array for new user', async(() => {
            await(lib.login(agent, userID));
            const res = await(agent.get('/api/characters/get'));
            assert.equal(res.status, 200, 'did not give http 200');
            const jsonRes = JSON.parse(res.text);
            assert.deepEqual(jsonRes, [], 'result was not empty array');
        }));
    });
    describe('create', () => {
        it('should give 401 without login', async(() => {
            const res = await(agent.get('/api/characters/create?name=boop'));
            assert.equal(res.status, 401, 'status was not 401');
        }));
        it('should give a 400 without any query parameters', async(() => {
            await(lib.login(agent, userID));
            const res = await(agent.get('/api/characters/create'));
            assert.equal(res.status, 400, 'status was not 400');
        }));
        it('should give 200 when logged in and with query parameter', async(() => {
            await(lib.login(agent, userID));
            const res = await(agent.get('/api/characters/create?name=boop'));
            assert.equal(res.status, 200, 'status was not 200');
        }));
        it('should give a json response with correct data types and name', async(() => {
            await(lib.login(agent, userID));
            const res = await(agent.get('/api/characters/create?name=foopus'));
            const parsed = JSON.parse(res.text);
            assert.isObject(parsed);
            assert.isNumber(parsed.characterid);
            assert.isNumber(parsed.position);
            assert.equal(parsed.name, 'foopus');
        }));
        // we could test multiple ones to verify that the characterid and position
        // are different/correct every time, but I've already written the get/create
        // tests and doing them again here would take more work. And anyways, the current
        // tests should be enough to verify the basic functionality
    });
    describe('get and create', () => {
        it('should insert then get a single row properly', async(() => {
            await(lib.login(agent, userID));
            const newRes = await(agent.get('/api/characters/create?name=boop'));
            const createdChar = JSON.parse(newRes.text);
            const res = await(agent.get('/api/characters/get'));
            const jsonRes = JSON.parse(res.text);
            const shouldEqual = [createdChar];
            assert.deepEqual(jsonRes, shouldEqual, 'resulting JSON incorrect');
        }));
        it('should return multiple rows properly', async(() => {
            await(lib.login(agent, userID));
            ['boop', 'yap', 'clap'].forEach((curName) => {
                await(agent.get(`/api/characters/create?name=${curName}`));
            });
            const res = await(agent.get('/api/characters/get'));
            const jsonRes = JSON.parse(res.text);
            assert.isArray(jsonRes, 'was not an array');
            assert.equal(jsonRes.length, 3, 'did not return 3 characters');
            assert.equal(jsonRes[0].name, 'boop');
            assert.equal(jsonRes[1].name, 'yap');
            assert.equal(jsonRes[2].name, 'clap');
            assert.equal(jsonRes[0].position, 0);
            assert.equal(jsonRes[1].position, 1);
            assert.equal(jsonRes[2].position, 2);
            assert.notEqual(jsonRes[0].characterid,
                jsonRes[1].characterid);
            assert.notEqual(jsonRes[1].characterid,
                jsonRes[2].characterid);
            assert.notEqual(jsonRes[0].characterid,
                jsonRes[2].characterid);
        }));
    });
});

'use strict';

const lib = require('./lib.js');
const urls = require('./urls.js');

const supertest = require('supertest-as-promised');

describe('Paths API', () => {
    let agent;
    let userID;

    beforeEach(() => {
        agent = supertest.agent(require(urls.server));
        userID = lib.getRandID();
    });

    before(lib.resetDB);

    describe('create and character API', () => {
        it('should give 401 when not logged in', async(() => {
            const res = await(agent.get('/api/paths/create?characterid=123&name=boopyap'));
            assert.equal(res.status, 401);
        }));
        it('should give 400 without proper query parameters', async(() => {
            await(lib.login(agent, userID));
            // we don't need to do any extremely thorough testing here because
            // we're just making sure the middleware is in use basically
            const res1 = await(agent.get('/api/paths/create?name=boop'));
            const res2 = await(agent.get('/api/paths/create?characterid=333'));
            assert.equal(res1.status, 400);
            assert.equal(res2.status, 400);
        }));
        it('should give 404 if the given character does not exist', async(() => {
            await(lib.login(agent, userID));
            const res = await(agent.get('/api/paths/create?characterid=666&name=welcometoDOOM'));
            assert.equal(res.status, 404);
        }));
        it('should give 404 when attempting to access a different players\' character', async(() => {
            await(lib.login(agent, userID));
            const characterid = lib.getCreatedID(await(agent.get('/api/characters/create?name=boopboopboop')));
            await(lib.login(agent, lib.getRandID()));
            const res = await(agent.get(`/api/paths/create?characterid=${characterid}&name=foopdatboopus`));
            assert.equal(res.status, 404);
        }));
        it('should give 200 and some data when character exists, etc', async(() => {
            await(lib.login(agent, userID));
            const characterid = lib.getCreatedID(await(agent.get('/api/characters/create?name=iamacatAMA')));
            const res = await(agent.get(`/api/paths/create?characterid=${characterid}&name=INSIDEbyPlaydead`));
            assert.equal(res.status, 200);
            const parsedRes = JSON.parse(res.text);
            assert.isNumber(parsedRes.pathid);
            assert.equal(parsedRes.name, 'INSIDEbyPlaydead');
        }));
    });

    describe('get-list', () => {
        it('should give 401 when not logged in', async(() => {
            const res = await(agent.get('/api/paths/get-list'));
            assert.equal(res.status, 401);
        }));
        it('should give 200 and empty array when logged in', async(() => {
            await(lib.login(agent, userID));
            const res = await(agent.get('/api/paths/get-list'));
            assert.equal(res.status, 200);
            const parsedRes = JSON.parse(res.text);
            assert.deepEqual(parsedRes, []);
        }));
    });

    describe('create and get-all', () => {
        it('should return a few created paths', async(() => {
            await(lib.login(agent, userID));
            const characterid = lib.getCreatedID(await(agent.get('/api/characters/create?name=yyyyyyy')));
            const path1id = lib.getCreatedpathid(await(agent.get(`/api/paths/create?characterid=${characterid}&name=pathone`)));
            const path2id = lib.getCreatedpathid(await(agent.get(`/api/paths/create?characterid=${characterid}&name=imtwo`)));
            const path3id = lib.getCreatedpathid(await(agent.get(`/api/paths/create?characterid=${characterid}&name=three`)));
            const res = await(agent.get('/api/paths/get-list'));
            assert.equal(res.status, 200);
            const parsedRes = JSON.parse(res.text);
            assert.deepEqual(parsedRes.sort(), [
                {
                    pathid: path1id,
                    name: 'pathone',
                },
                {
                    pathid: path2id,
                    name: 'imtwo',
                },
                {
                    pathid: path3id,
                    name: 'three',
                },
            ].sort());
        }));
    });

    describe('get', () => {
        it('should give 401 when not logged in', async(() => {
            const res = await(agent.get('/api/paths/get?pathid=234'));
            assert.equal(res.status, 401);
        }));
        // for some reason the following sentence is painful to read
        it('should give 400 when missing required query param', async(() => {
            await(lib.login(agent, userID));
            const res = await(agent.get('/api/paths/get'));
            assert.equal(res.status, 400);
        }));
    });

    describe('create and get', () => {
        it('should ', async(() => {
        }));
    });
});

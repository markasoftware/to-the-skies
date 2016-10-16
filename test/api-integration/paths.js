'use strict';

const lib = require('../lib/lib.js');
const urls = require('../lib/urls.js');
const helpers = require('../lib/api-helpers.js');

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
        it('should give 401 when not logged in', helpers.checkLogin('/api/paths/create?characterid=123&name=tttrho'));
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
        it('should give 200 when character exists', async(() => {
            await(lib.login(agent, userID));
            const characterid = lib.getCreatedID(await(agent.get('/api/characters/create?name=iamacatAMA')));
            const res = await(agent.get(`/api/paths/create?characterid=${characterid}&name=INSIDEbyPlaydead`));
            assert.equal(res.status, 200);
            const parsedRes = JSON.parse(res.text);
            assert.isNumber(parsedRes.pathid);
        }));
        it('should insert into the database properly', async(() => {
            await(lib.login(agent, userID));
            const characterid = lib.getCreatedID(await(agent.get('/api/characters/create?name=waxel')));
            const pathid = lib.getCreatedPathid(await(agent.get(`/api/paths/create?characterid=${characterid}&name=urmomlol`)));
            // this will error if there isn't a row so we don't need extra checks
            const dbRes = await(lib.db.one(`
                SELECT *
                FROM paths
                WHERE name = 'urmomlol'
                AND pathid = ${pathid}
            `));
            // should not be published
            assert.strictEqual(dbRes.published, false);
            await(lib.db.one(`
                SELECT *
                FROM node_coordinates
                WHERE pathid = ${pathid}
                AND nodeid = 1
            `));
        }));
        describe('and publish', () => {
            it('should give 401 when not logged in', helpers.checkLogin('/api/paths/publish?pathid=7'));
            it('should give 400 without pathid parameter', async(() => {
                await(lib.login(agent, userID));
                const res = await(agent.get('/api/paths/publish'));
                assert.equal(res.status, 400);
            }));
            it('should give 404 when the pathid does not exist', async(() => {
                await(lib.login(agent, userID));
                const res = await(agent.get('/api/paths/publish?pathid=9999'));
                assert.equal(res.status, 404);
            }));
            it('should give 404 when the path is owned by another player', async(() => {
                // we'll just test against the default path
                await(lib.login(agent, userID));
                const res = await(agent.get('/api/paths/publish?pathid=1'));
                assert.equal(res.status, 404);
            }));
            it('should give 200 and update database when run properly', async(() => {
                await(lib.login(agent, userID));
                const pathid = await(helpers.createCharAndPath(agent));
                const res = await(agent.get(`/api/paths/publish?pathid=${pathid}`));
                assert.equal(res.status, 200);
                const dbRes = await(lib.db.one(`
                    SELECT published
                    FROM paths
                    WHERE pathid = ${pathid}
                `));
                assert.strictEqual(dbRes.published, true);
            }));
            it('should give 404 if the path has already been published', async(() => {
                await(lib.login(agent, userID));
                const pathid = await(helpers.createCharAndPath(agent));
                await(agent.get(`/api/paths/publish?pathid=${pathid}`));
                const res = await(agent.get(`/api/paths/publish?pathid=${pathid}`));
                assert.equal(res.status, 404);
            }));
        });
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

    describe('create and get-list', () => {
        it('should return a few created paths', async(() => {
            await(lib.login(agent, userID));
            const characterid = lib.getCreatedID(await(agent.get('/api/characters/create?name=yyyyyyy')));
            const path1id = lib.getCreatedPathid(await(agent.get(`/api/paths/create?characterid=${characterid}&name=pathone`)));
            const path2id = lib.getCreatedPathid(await(agent.get(`/api/paths/create?characterid=${characterid}&name=imtwo`)));
            const path3id = lib.getCreatedPathid(await(agent.get(`/api/paths/create?characterid=${characterid}&name=three`)));
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

    describe('delete', () => {
        it('should give 401 when not logged in', async(() => {
            const res = await(agent.get('/api/paths/delete?pathid=400'));
            assert.equal(res.status, 401);
        }));
        it('should give 400 when missing pathid param', async(() => {
            await(lib.login(agent, userID));
            const res = await(agent.get('/api/paths/delete'));
            assert.equal(res.status, 400);
        }));
        it('should give 404 if the given path does not exist', async(() => {
            await(lib.login(agent, userID));
            const res = await(agent.get('/api/paths/delete?pathid=6666'));
            assert.equal(res.status, 404);
        }));
    });

    describe('create, delete, publish, and get-list', () => {
        it('should give 404 when trying to delete somebody else\'s path', async(() => {
            await(lib.login(agent, userID));
            const characterid = lib.getCreatedID(await(agent.get('/api/characters/create?name=aoeuhtnseuaohtns')));
            const pathid = lib.getCreatedPathid(await(agent.get(`/api/paths/create?characterid=${characterid}&name=mnifaicfb`)));
            await(lib.login(agent, lib.getRandID()));
            const res = await(agent.get(`/api/paths/delete?pathid=${pathid}`));
            assert.equal(res.status, 404);
        }));
        it('should create a couple paths, delete one, give 200, and no longer return it', async(() => {
            await(lib.login(agent, userID));
            const characterid = lib.getCreatedID(await(agent.get('/api/characters/create?name=aoeuhtnseuaohtns')));
            // k is for keep, d is for delete
            const kPathid = lib.getCreatedPathid(await(agent.get(`/api/paths/create?characterid=${characterid}&name=mnifaicfb`)));
            const dPathid = lib.getCreatedPathid(await(agent.get(`/api/paths/create?characterid=${characterid}&name=bbtttrrr`)));
            const delRes = await(agent.get(`/api/paths/delete?pathid=${dPathid}`));
            assert.equal(delRes.status, 200);
            const parsedRes = JSON.parse(await(agent.get('/api/paths/get-list')).text);
            assert.deepEqual(parsedRes, [
                {
                    pathid: kPathid,
                    name: 'mnifaicfb',
                },
            ]);
        }));
        it('should give 404 if path is already published', async(() => {
            await(lib.login(agent, userID));
            const pathid = await(helpers.createCharAndPath(agent));
            await(agent.get(`/api/paths/publish?pathid=${pathid}`));
            const res = await(agent.get(`/api/paths/delete?pathid=${pathid}`));
            assert.equal(res.status, 404);
        }));
    });
});

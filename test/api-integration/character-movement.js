'use strict';

const lib = require('../lib/lib.js');
const urls = require('../lib/urls.js');
const supertest = require('supertest-as-promised');

describe('Character movement API', () => {
    before(lib.resetDB);

    const server = require(urls.server);
    const baseUrl = '/api/character-movement/';
    const getCurrentUrl = `${baseUrl}get-current`;
    const getNextUrl = `${baseUrl}get-next`;
    let agent;
    let userID;

    beforeEach(() => {
        agent = supertest.agent(server);
        userID = lib.getRandID();
    });

    describe('character movement only', () => {
        describe('get-current', () => {
            it('should give 401 when not logged in', async(() => {
                const res = await(agent.get(`${getCurrentUrl}?characterid=221`));
                assert.equal(res.status, 401);
            }));
            it('should give 404 for non-existing character', async(() => {
                await(lib.login(agent, userID));
                const res = await(agent.get(`${getCurrentUrl}?characterid=2892347`));
                assert.equal(res.status, 404);
            }));
            it('should give 400 without characterid parameter', async(() => {
                await(lib.login(agent, userID));
                const res = await(agent.get(getCurrentUrl));
                assert.equal(res.status, 400);
            }));
        });
        describe('get-next', () => {
            it('should give 401 when not logged in', async(() => {
                const res = await(agent.get(`${getNextUrl}?charatterid=123&optionid=2`));
                assert.equal(res.status, 401);
            }));
            it('should give 404 for non-existant character', async(() => {
                await(lib.login(agent, userID));
                const res = await(agent.get(`${getNextUrl}?characterid=234234&optionid=1`));
                assert.equal(res.status, 404);
            }));
            it('should give 400 without params', async(() => {
                await(lib.login(agent, userID));
                const res1 = await(agent.get(`${getNextUrl}?characterid=123123`));
                const res2 = await(agent.get(`${getNextUrl}?optionid=1`));
                const res3 = await(agent.get());
                assert.equal(res1.status, 400);
                assert.equal(res2.status, 400);
                assert.equal(res3.status, 400);
            }));
        });
    });
    describe('movement and characters', () => {
        it('should return the first node for a new character', async(() => {
            await(lib.login(agent, userID));
            const createdID = lib.getCreatedID(await(agent.get(
                '/api/characters/create?name=boopyoop'
            )));
            const res = await(agent.get(`${getCurrentUrl}?characterid=${createdID}`));
            assert.equal(res.status, 200);
            const parsedRes = JSON.parse(res.text);
            assert.equal(parsedRes.content, 'The ship floats upwards, to the skies.');
            assert.isArray(parsedRes.options, 'options should be array');
            assert.equal(parsedRes.options.length, 2, 'should be 2 options');
            assert.equal(parsedRes.options[0].content, 'This is option 1');
            assert.equal(parsedRes.options[0].optionid, 1);
            assert.equal(parsedRes.options[1].content, 'This is option 2');
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
                '/api/nodes/create?pathid=1&text=Y+tho&options=opt1&options=opt2'
            ));
            assert.equal(res.status, 200);
            const parsedRes = JSON.parse(res);
            assert.isNumber(parsedRes.nodeid);
            // TODO
        }));
    });
});

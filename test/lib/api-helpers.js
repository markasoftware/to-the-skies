'use strict';

const lib = require('./lib.js');
const urls = require('./urls.js');
const chance = new (require('chance'))();
const supertest = require('supertest-as-promised')(Promise)(require(urls.server));

function genName() {
    return chance.string({ pool: 'aoeuhtnsbxk' });
}

module.exports.checkLogin = url =>
    async(() => {
        const res = await(supertest.get(url));
        assert.equal(res.status, 401, 'status should be 401 unauthorized');
    });

module.exports.createCharacter = async(agent => {
    const charName = genName();
    return lib.getCreatedID(await(agent.get(`/api/characters/create?name=${charName}`)));
});

module.exports.createPath = async((agent, characterid) => {
    const pathName = genName();
    return lib.getCreatedPathid(await(agent.get(`/api/paths/create?characterid=${characterid}&name=${pathName}`)));
});

module.exports.createCharAndPath = async(agent => {
    const characterid = await(module.exports.createCharacter(agent));
    return await(module.exports.createPath(agent, characterid));
});

module.exports.publishPath = (agent, pathid) =>
    agent.get(`/api/paths/publish?pathid=${pathid}`);

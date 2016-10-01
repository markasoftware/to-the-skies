'use strict';

const lib = require('../lib/lib.js');
const urls = require('../lib/urls.js');
const proxyquire = require('proxyquire');

describe('character list', () => {
    let getAllReturns;
    let createReturns;
    const storageStub = {
        characters: {
            getAll: async(() => getAllReturns),
            create: async(() => createReturns),
        },
    };

    let characterList;
    beforeEach(() => {
        lib.unCache(urls.characterList);
        characterList = proxyquire(urls.characterList, { './storage.js': storageStub });
    });

    describe('init and get all', () => {
        it('should be empty array with no data', async(() => {
            getAllReturns = [];
            await(characterList.init());
            const res = characterList.getAll();
            assert.isArray(res);
            assert.equal(res.length, 0);
        }));
        it('should work with a single character', async(() => {
            getAllReturns = [{
                characterid: 123,
                name: 'Boop Yap',
                position: 0,
            }];
            await(characterList.init());
            const res = characterList.getAll();
            assert.isArray(res);
            assert.equal(res.length, 1);
            assert.equal(res[0].characterid(), 123);
            assert.equal(res[0].name(), 'Boop Yap');
            assert.equal(res[0].position(), 0);
        }));
        it('should work with multiple characters', async(() => {
            getAllReturns =
            [
                {
                    characterid: 273,
                    name: 'Helen Keller',
                    position: 0,
                },
                {
                    characterid: 1,
                    name: 'B',
                    position: 2,
                },
                {
                    characterid: 9999,
                    name: '1234567890',
                    position: 1,
                },
            ];

            await(characterList.init());
            const res = characterList.getAll();
            assert.isArray(res);
            assert.equal(res.length, 3);
            // we can't test everything without mirroring bullshit
            assert.equal(res[2].position(), 1);
            assert.equal(res[0].name(), 'Helen Keller');
            assert.equal(res[1].characterid(), 1);
        }));
    });
    describe('create', () => {
        it('should create a single character when none exist', async(() => {
            getAllReturns = [];
            createReturns = {
                characterid: 888,
                name: 'foopus',
                position: 89,
            };
            await(characterList.init());
            await(characterList.create('foopus'));
            const res = characterList.getAll();
            assert.isArray(res);
            assert.equal(res.length, 1);
            assert.equal(res[0].characterid(), 888);
            assert.equal(res[0].name(), 'foopus');
            assert.equal(res[0].position(), 89);
        }));
        it('should create a character when some already exist', async(() => {
            getAllReturns = [
                {
                    characterid: 920,
                    name: 'boopus',
                    position: 0,
                },
                {
                    characterid: 234,
                    name: 'bap%%yap',
                    position: 1,
                },
            ];
            createReturns = {
                characterid: 99,
                name: 'BOP IT!',
                position: 2,
            };
            await(characterList.init());
            await(characterList.create('BOP IT!'));
            const res = characterList.getAll();
            assert.isArray(res);
            assert.equal(res.length, 3);
            assert.equal(res[2].characterid(), 99);
            assert.equal(res[1].name(), 'bap%%yap');
            assert.equal(res[0].position(), 0);
        }));
    });
});

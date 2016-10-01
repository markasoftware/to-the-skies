'use strict';

const urls = require('../lib/urls.js');
const lib = require('../lib/lib.js');

const rewire = require('rewire');

describe('storage/persistence (cu)', () => {
    const storage = rewire(urls.storage);

    describe('user', () => {
        global.location = null;
        const setSearch = (queryStr) =>
            storage.__set__('location', { search: queryStr });

        describe('get', () => {
            it('should say true when li in search', () => {
                setSearch('?li');
                assert.equal(storage.user.get(), true);
            });
            it('should say false when li not in search', () => {
                setSearch('');
                assert.equal(storage.user.get(), false);
                setSearch('?bmtaoebtsoeuats=aoeaoeu&b=r');
                assert.equal(storage.user.get(), false);
            });
        });
    });
});

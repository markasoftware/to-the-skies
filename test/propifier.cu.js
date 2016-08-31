'use strict';

require('./lib.js');
const urls = require('./urls.js');

describe('propifier', () => {
    const propify = require(urls.propifier);

    it('should return the same object if empty', () => {
        assert.deepEqual(propify({}), {});
    });
    it('should propify a single property', () => {
        const propified = propify({ foopus: 'cat' });
        assert.isFunction(propified.foopus);
        assert.deepEqual(Object.keys(propified), ['foopus']);
        assert.equal(propified.foopus(), 'cat');
        propified.foopus('dog');
        assert.equal(propified.foopus(), 'dog');
    });
    it('should propify multiple properties', () => {
        const propified = propify({
            foopus: 'cat',
            blop: 'blob',
            fat: 'dog',
        });
        ['foopus', 'blop', 'fat'].forEach((curKey) => {
            assert.isFunction(propified[curKey]);
        });
        assert.equal(propified.blop(), 'blob');
        assert.equal(propified.foopus(), 'cat');
        assert.equal(propified.fat(), 'dog');
        propified.fat('hh');
        assert.equal(propified.fat(), 'hh');
        assert.equal(Object.keys(propified).length, 3);
    });
});

const assert = require('chai').assert;
const proxyquire = require('proxyquire');
//replace with "real" one once with wifi
//I'm so lucky to have downloaded this by chance
//come sir your passado
const td = require('./testdouble.js');

const urls = require('./urls.js');
const lib = require('./lib.js');

describe('API utils', () => {
    describe('check login', () => {

        const apiUtils = require(urls.apiUtils);
        const resMock = {
            status: function() { return this },
            json: function() { return this}
        }

        it('should return true when not logged in', () => {
            const notLoggedIn = apiUtils.checkLogin({user: null}, resMock);
            assert.isOk(notLoggedIn);
        });
        it('should return false when logged in', () => {
            const notLoggedIn = apiUtils.checkLogin({user: 628}, resMock);
            assert.isNotOk(notLoggedIn);
        });
        it('should give 401 and json when not logged in', () => {
            const nResMock = td.object(resMock);
            td.when(nResMock.status(td.matchers.anything())).thenReturn(nResMock);
            apiUtils.checkLogin({user: null}, nResMock);
            td.verify(nResMock.status(401));
            td.verify(nResMock.json(td.matchers.isA(String)));
        });
    });
});

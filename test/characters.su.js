const proxyquire = require('proxyquire');
const td = require('./testdouble');

const urls = require('./urls')
const lib = require('./lib');

describe('character API', () => {

    const ignoreStuff = {times: 0, ignoreExtraArgs: true};
    let resMock;
    beforeEach(() => {
        resMock = td.object({
            status: () => {},
            json: () => {}
        });
    });

    describe('get', () => {
        it('should let checklogin do the work when not logged in', () => {
            let proxyArg = {};
            libMock[urls.apiLib].checkLogin = () => true;
            const charLogic = proxyquire.noCallThru()(urls.charApi, proxyArg);
            charLogic.get({user: null}, resMock);
            td.verify(resMock.status(), ignoreStuff);
            td.verify(resMock.json(), ignoreStuff);
        });
        it('should return the rows from dbGet', () => {
            let proxyArg = {};
            proxyArg[urls.apiLib].checkLogin = () => false;
            proxyArg[urls.dbInt] = { characters: { get:
                td.function()
            }};
            td.when(proxyArg[urls.dbInt].characters.get(830))
                .thenReturns(['sloop', 'kloop']);
            
}); 

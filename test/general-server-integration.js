const supertest = require('supertest-as-promised');

const lib = require('./lib.js');
const urls = require('./urls.js');

describe('general server side integration', () => {

    const server = require(urls.server);
    let agent;

    beforeEach(() => {
        agent = supertest.agent(server);
    });

    describe('static file serving', () => {
        it('should give 200 and html for /index.html', async(() => {
            const res = await(agent.get('/index.html'));
            assert.equal(res.status, 200, 'did not give http 200');
            assert.include(res.headers['content-type'], 'text/html', 'did not have html type header');
        }));

        it('should return the same thing for / and /index.html', async(() => {
            const resSlash = await(agent.get('/'));
            const resIndex = await(agent.get('/index.html'));
            assert.equal(resSlash.status, 200, 'did not give http 200');
            assert.equal(resIndex.status, 200, 'did not give http 200');
            assert.equal(resSlash.text, resIndex.text, 'did not have equivalent contents');
        }));

        it('should give 404 and html for non-existant page', async(() => {
            const res = await(agent.get('/dedgeaogucgeod'));
            assert.equal(res.status, 404, 'did not give 404 status');
            assert.include(res.headers['content-type'], 'text/html', 'not html content type');
        }));
    });
});

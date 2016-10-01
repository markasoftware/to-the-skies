const supertest = require('supertest-as-promised');

const lib = require('../lib/lib.js');
const urls = require('../lib/urls.js');

describe('general server side integration', () => {

    const server = require(urls.server);
    let agent;

    beforeEach(() => {
        agent = supertest.agent(server);
    });

    describe('static file serving', () => {
        it('should give 200 and html for /', async(() => {
            const res = await(agent.get('/'));
            assert.equal(res.status, 200, 'did not give http 200');
            assert.include(res.headers['content-type'], 'text/html', 'did not have html type header');
        }));

        it('should redirect from /index.html to /', async(() => {
            const res = await(agent.get('/index.html'));
            assert.equal(res.status, 302, 'did not give http 302');
            assert.equal(res.headers['location'], '/', 'did not redirect to /');
        }));

        it('should give 404 and html for non-existant page', async(() => {
            const res = await(agent.get('/dedgeaogucgeod'));
            assert.equal(res.status, 404, 'did not give 404 status');
            assert.include(res.headers['content-type'], 'text/html', 'not html content type');
        }));
    });
});

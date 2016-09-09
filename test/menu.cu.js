'use strict';

const lib = require('./lib.js');
const urls = require('./urls.js');
const xhrMock = require('xhr-mock');

describe('left menu', () => {
    global.location = {};
    let view;
    let ctrl;

    beforeEach(() => {
        lib.clearCache();
        view = require(urls.menuView);
        Ctrl = require(urls.menuCtrl);
    });

    it('should have just close and login rows when not logged in', () => {
        global.location.search = '';
        const rendered = view(new Ctrl());
        assert.equal(rendered.length, 2);
    });
});

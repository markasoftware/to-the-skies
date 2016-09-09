'use strict';

const m = require('mithril');

// hardcoded components list
const c = {
    home: {
        view: require('./home/view.js'),
    },
    menu: {
        view: require('./menu/view.js'),
        controller: require('./menu/controller.js'),
    },
};

// routing
m.route.mode = 'hash';
m.route(document.getElementById('main-wrap'), '/', {
    '/': c.home,
});

// mounting
m.mount(document.getElementById('left-menu'), c.menu);

// left menu opener
// it should register event listeners when loaded
require('./left-menu-opener.js');

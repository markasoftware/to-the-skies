'use strict';

require('./lib.js');
const urls = require('./urls.js');

describe('node view', () => {
    const nodeView = require(urls.nodeView);

    const fakeOptions = [
        {
            content: 'yoop',
            optionid: 123,
        },
        {
            content: 'boop',
            optionid: 12,
        },
        {
            content: 'I agree',
            optionid: 123456,
        },
        {
            content: 'I am wrong',
            optionid: 333,
        },
        {
            content: 'Zion is also a cat',
            optionid: 12,
        },
        {
            content: 'He is also fluffy',
            optionid: 77,
        },
    ];
    const fakeNodes = [
        {
            content: 'boop',
            options: [fakeOptions[0], fakeOptions[1]],
        },
        {
            content: 'Axel is a cat',
            options: fakeOptions,
        },
    ];

    it('should say select a character when none is selected', () => {
        const fakeCtrl = {
            selectedChar: false,
            node: fakeNodes[0],
        };
        const res = menuView(fakeCtrl);
        assert.notEqual(res.children[0].toLowerCase().indexOf('character'), -1, 'should include "character"');
    });
});

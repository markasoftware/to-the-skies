'use strict';

const lib = require('./lib.js');
const urls = require('./urls.js');
const m = require('mithril');

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
        {
            content: 'irrelevant',
            options: [fakeOptions[0], fakeOptions[1], fakeOptions[2], fakeOptions[3]],
        },
        {
            content: 'irrelevant',
            options: [
                fakeOptions[0],
                fakeOptions[1],
                fakeOptions[2],
                fakeOptions[3],
                fakeOptions[4],
            ],
        },
    ].map(m.prop);

    it('should say select a character when none is selected', () => {
        const fakeCtrl = m.prop({ notSelected: true });
        const res = nodeView(fakeCtrl);
        const mainText = res.children[0].children[0];
        assert.notEqual(mainText.indexOf('character'), -1, 'should include "character"');
    });
    it('should have 2 options properly', () => {
        const fakeCtrl = fakeNodes[0];
        const res = nodeView(fakeCtrl);
        const mainText = res.children[0].children[0];
        const opts = res.children[1].children;
        assert.equal(mainText, 'boop');
        assert.include(opts[0].attrs.className, 'top');
        assert.include(opts[0].attrs.className, 'left');
        assert.include(opts[1].attrs.className, 'top');
        assert.include(opts[1].attrs.className, 'right');
        assert.equal(opts[0].children[0], 'yoop');
        assert.equal(opts[1].children[0], 'boop');
    });
    it('should have fourth option at bottom center', () => {
        const fakeCtrl = fakeNodes[2];
        const res = nodeView(fakeCtrl);
        const optClasses = [];
        res.children[1].children.forEach((cur) => optClasses.push(cur.attrs.className));
        assert.include(optClasses[3], 'bottom');
        assert.include(optClasses[3], 'center');
    });
    it('should have fourth and fifth options at left and right bottom', () => {
        const res = nodeView(fakeNodes[3]);
        const optClasses = [];
        res.children[1].children.forEach((cur) => optClasses.push(cur.attrs.className));
        assert.include(optClasses[4], 'bottom');
        assert.include(optClasses[4], 'right');
        assert.include(optClasses[3], 'bottom');
        assert.include(optClasses[3], 'left');
    });
    it('should have 6 options properly', () => {
        const fakeCtrl = fakeNodes[1];
        const res = nodeView(fakeCtrl);
        const opts = res.children[1].children;
        const optClasses = [];
        opts.forEach((cur) => optClasses.push(cur.attrs.className));
        assert.include(optClasses[4], 'bottom');
        assert.include(optClasses[4], 'center');
        assert.include(optClasses[5], 'bottom');
        assert.include(optClasses[5], 'right');
    });
});

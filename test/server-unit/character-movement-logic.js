'use strict';

require('../lib/lib.js');
const urls = require('../lib/urls.js');

describe('character movement lib', () => {
    const cmLogic = require(urls.characterMovementLogic);

    it('should rearrarange current stuff right', () => {
        const fakeDbRes = [
            {
                node_content: 'boop',
                optionid: 34,
                option_content: '1yaap',
            },
            {
                node_content: 'boop',
                optionid: 454,
                option_content: '2yaap',
            },
        ];
        const res = cmLogic.processGetCurrentRes(fakeDbRes);
        assert.equal(res.content, 'boop', 'should have correct node content');
        assert.isArray(res.options, 'options should be array');
        assert.equal(res.options.length, 2, 'should be 2 options');
        assert.equal(res.options[0].optionid, 34);
        assert.equal(res.options[0].content, '1yaap');
        assert.equal(res.options[1].optionid, 454);
        assert.equal(res.options[1].content, '2yaap');
    });
});

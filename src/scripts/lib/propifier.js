'use strict';

const m = require('mithril');

module.exports = (inObj) => {
    const toReturn = {};
    Object.keys(inObj).forEach((curKey) => {
        toReturn[curKey] = m.prop(inObj[curKey]);
    });
    return toReturn;
};

'use strict';

const characterList = require('../models/character-list.js');

module.exports = class {
    constructor() {
        // will stop view from rendering until loaded
        characterList.init();
    }
};

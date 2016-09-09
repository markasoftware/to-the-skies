'use strict';

const characterList = require('../models/character-list.js');
const storage = require('../models/storage.js');
const m = require('mithril');

const vm = {
    creating: m.prop(false),
    clickedChar: m.prop(),
};

module.exports = class {
    constructor() {
        // will stop view from rendering until loaded
        characterList.init();

        this.creating = vm.creating;
        this.clickedChar = vm.clickedChar;
    }

    startNewCharacter() {
        vm.creating(true);
    }

    finishNewCharacter(e) {
        const inputValue = e.target.previousSibling.value;
        characterList.create(inputValue);
        vm.creating(false);
    }
};

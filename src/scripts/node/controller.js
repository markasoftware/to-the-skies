'use strict';

const characterList = require('../models/character-list.js');
const storage = require('../models/storage.js');
const m = require('mithril');

module.exports = function () {
    const toReturn = m.prop();
    function updateWithNode() {
        const characterid = characterList.selectedCharacterid;
        storage.characterMovement.getCurrent(characterid).then(toReturn);
        m.redraw();
    }
    characterList.registerSelectListener(updateWithNode);
    if (!characterList.charSelected) {
        toReturn({ notSelected: true });
        return toReturn;
    }
    updateWithNode();
    return toReturn;
};

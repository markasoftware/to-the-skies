'use strict';

const storage = require('./storage.js');
const propify = require('../lib/propifier.js');
const m = require('mithril');

const characterList = {};

const privateList = m.prop();

characterList.init = () =>
    storage.characters.getAll()
    .then((tempList) =>
        // propify the properties of the characters, not the characters themselves
        tempList.map(propify)
    )
    .then(privateList);

characterList.getAll = privateList;

characterList.create = (name) =>
    storage.characters.create(name)
    .then((res) =>
        privateList().push(propify(res))
    );

characterList.delete = (characterid) => {
    privateList().splice(
        privateList().findIndex((cur) => cur.characterid === characterid),
        1
    );
    storage.characters.delete(characterid);
};

const listeners = [];

characterList.registerForChange = (listener) =>
    listeners.push(listener);

characterList.selectCharacter = (id) =>
    listeners.forEach((curListener) =>
        curListener(id)
    );

module.exports = characterList;

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

module.exports = characterList;

'use strict';

const baseURL = `${__dirname}/../../src/`;
const routerURL = 'routers/';
const libURL = 'lib/';
const logicURL = 'logic/';
const clientScriptsURL = 'scripts/';

const baseAPI = '/api/';
const basePmod = 'pmod/';
const baseCharacters = 'characters/';
const baseCharacterMovement = 'character-movement/';
const basePaths = 'paths/';

const pmodURLs = {
    get: 'get',
    createNode: 'nodes/create',
    updateNode: 'nodes/update',
    deleteNode: 'nodes/delete',
    createOption: 'options/create',
    updateOption: 'options/update',
    deleteOption: 'options/delete',
    createConnection: 'connections/create',
    deleteConnection: 'connections/delete',
};
const characterURLs = {
    create: 'create',
    update: 'update',
    delete: 'delete',
    get: 'get',
};
const pathURLs = {
    create: 'create',
    update: 'update',
    delete: 'delete',
    publish: 'publish',
    get: 'get',
    getList: 'get-list',
};

module.exports.pmod = {};
Object.keys(pmodURLs).forEach(curKey => {
    module.exports.pmod[curKey] = baseAPI + basePmod + pmodURLs[curKey];
});
module.exports.characters = {};
Object.keys(characterURLs).forEach(curKey => {
    module.exports.characters[curKey] = baseAPI + baseCharacters + characterURLs[curKey];
});
module.exports.paths = {};
Object.keys(pathURLs).forEach(curKey => {
    module.exports.characters[curKey] = baseAPI + basePaths + pathURLs[curKey];
});

const serverLogic = {
    characterMovementLogic: 'character-movement-logic.js',
};
const libs = {
    dbInt: 'db-interface.js',
    apiUtils: 'api-utils.js',
};
const routers = {
    charApi: 'characters-logic.js',
};
const clientScripts = {
    mithril: 'mithril.min.js',
    menuView: 'menu/view.js',
    menuCtrl: 'menu/controller.js',
    storage: 'models/storage.js',
    characterList: 'models/character-list.js',
    propifier: 'lib/propifier.js',
    nodeView: 'node/view.js',
    nodeCtrl: 'node/controller.js',
};

Object.keys(libs).forEach((curKey) => {
    module.exports[curKey] = baseURL + routerURL + libURL + libs[curKey];
});

Object.keys(clientScripts).forEach((curKey) => {
    module.exports[curKey] = baseURL + clientScriptsURL + clientScripts[curKey];
});
Object.keys(routers).forEach((curKey) => {
    module.exports[curKey] = baseURL + routerURL + routers[curKey];
});
Object.keys(serverLogic).forEach((curKey) => {
    module.exports[curKey] = baseURL + routerURL + logicURL + serverLogic[curKey];
});

module.exports.server = `${baseURL}server.js`;

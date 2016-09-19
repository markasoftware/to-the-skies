'use strict';

const baseURL = `${__dirname}/../src/`;
const routerURL = 'routers/';
const libURL = 'lib/';
const logicURL = 'logic/';
const clientScriptsURL = 'scripts/';

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

const baseURL = __dirname + '/../src/';
const routerURL = 'routers/';
const libURL = 'lib/';
const clientScriptsURL = 'public/scripts/'

const libs = {
    dbInt: 'db-interface.js',
    apiUtils: 'api-utils.js'
}
const routers = {
    charApi: 'characters-logic.js'
}
const clientScripts = {
    mithril: 'mithril.min.js',
    menuView: 'menu/view.js',
    menuCtrl: 'menu/controller.js'
}

Object.keys(libs).forEach((curKey) => {
    module.exports[curKey] = baseURL + routerURL + libURL + libs[curKey];
});

Object.keys(clientScripts).forEach((curKey) => {
    module.exports[curKey] = baseURL + clientScriptsURL + clientScripts[curKey];
});
Object.keys(routers).forEach((curKey) => {
    module.exports[curKey] = baseURL + routerURL + routers[curKey];
});

module.exports.server = baseURL + 'server.js';

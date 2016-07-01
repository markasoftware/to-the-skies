const baseURL = '../src/';
const routerURL = 'routers/';
const libURL = 'lib/';

const libs = {
    dbInt: 'db-interface.js'
}

Object.keys(libs).forEach((curKey) => {
    module.exports[curKey] = baseURL + routerURL + libURL + libs[curKey];
});

module.exports.server = baseURL + 'server.js';

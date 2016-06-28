const baseURL = '../src/ss-scripts/';

const urls = {
    dbInt: 'db-interface.js'
}

Object.keys(urls).forEach((curKey) => {
    module.exports[curKey] = baseURL + urls[curKey]
});

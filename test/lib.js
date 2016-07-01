//this file has general purpose functions used throughout the tests

const urls = require('./urls.js');
const rewire = require('rewire');
const express = require('express');

//general

process.env.DB_NAME = 'to_the_skies_test';

module.exports.unCache = (url) => {
    if(require.cache[require.resolve(url)])
        delete require.cache[require.resolve(url)];
}

//integration/routers

module.exports.appify = (router) => {
    const app = express();
    app.use(router);
    return app;
}

//database

const dbUser = process.env.DB_USER || 'to_the_skies';

function dropDB(done){
    require('child_process').exec('dropdb to_the_skies_test', (err, stdout, stderr) => {
        if(err && stderr.indexOf('does not exist') === -1) console.error('An error occuring dropping the database. stderr:' + stderr + ' stdout: ' + stdout);
        done();
    });
}
function createDB(done){
    require('child_process').exec('createdb to_the_skies_test --owner ' + dbUser + ' --template to_the_skies_template', function(err, stdout, stderr){
        if(err) console.error('An error occured creating the database. stderr: ' + stderr + ' stdout: ' + stdout);
        done();
    });
}
module.exports.resetDB = (done) => {
    dropDB(() => {
        createDB(done);
    });
}

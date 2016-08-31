'use strict';

// this file has general purpose functions used throughout the tests

const urls = require('./urls.js');
const rewire = require('rewire');
const express = require('express');
const fs = require('fs');
global.async = require('asyncawait/async');
global.await = require('asyncawait/await');
global.assert = require('chai').assert;
const chance = require('chance')();

// general

process.env.DB_NAME = 'to_the_skies_test';

module.exports.unCache = (url) => {
    if (require.cache[require.resolve(url)]) {
        delete require.cache[require.resolve(url)];
    }
};

module.exports.throwErr = (err) => {
    throw err;
};

module.exports.getRaw = (filePath) =>
    fs.readFileSync(filePath, 'utf8');

module.exports.getRandID = () =>
    chance.string({ length: 21, pool: '1234567890' });

// integration/routers

module.exports.appify = (router) => {
    const app = express();
    app.use(router);
    return app;
};

// database

module.exports.db = rewire(urls.dbInt).__get__('db');

const dbUser = process.env.DB_USER || 'to_the_skies';

function dropDB(done) {
    require('child_process').exec('dropdb to_the_skies_test', (err, stdout, stderr) => {
        if (err && stderr.indexOf('does not exist') === -1) {
            console.error(
                `An error occuring dropping the database. stderr: ${stderr} stdout: ${stdout}`
            );
        }
        done();
    });
}
function createDB(done) {
    require('child_process')
        .exec(`createdb to_the_skies_test --owner ${dbUser} --template to_the_skies_template`,
            (err, stdout, stderr) => {
                if (err) {
                    console.error(
                    `An error occured creating the database. stderr: ${stderr} stdout: ${stdout}`
                    );
                }
                done();
            });
}

module.exports.resetDB = function mustHaveAName(done) {
    // on slower devices it can take longer than the default 2000ms for the database to reset
    this.timeout(5000);
    dropDB(() => {
        createDB(done);
    });
};

module.exports.resetDBPromise = () =>
    new Promise((resolve, reject) => {
        try {
            dropDB(() => { createDB(resolve); });
        } catch (e) { reject(e); }
    });

module.exports.newUser = async((db) =>
    await(db.one(
        'INSERT INTO users (googleid) VALUES ($1) RETURNING userid;',
        [module.exports.getRandID()]
    )).userid
);

// login

module.exports.login = (agent, id) =>
    agent
        .get(`/auth/google/callback?id=${id}`)
        .expect('set-cookie', /^connect\.sid=s.{20,}/)
        .expect(302);

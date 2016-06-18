"use strict";

const sinon = require('sinon');
const rewire = require('rewire');
const assert = require('chai').assert;

const dbIntUrl = '../src/db-interface.js';

describe('server unit', () => {
    describe('environment variables check', () => {

        //backup environment variables
        let enviroBackup = {};

        before(() => { Object.assign(enviroBackup, process.env) });
        beforeEach(() => {
            if(require.cache[require.resolve(dbIntUrl)])
                delete require.cache[require.resolve(dbIntUrl)];
        });
        afterEach(() => { Object.assign(process.env, enviroBackup) });

        describe('connection string', () => {

            it('should have the correct default', () => {
                assert.deepEqual(rewire(dbIntUrl).__get__('conConfig'),
                        {
                            user: 'postgres',
                            password: 'password',
                            host: 'localhost',
                            database: 'to_the_skies_dev'
                        });
            });

            it('should work with some modified vars', () => {
                process.env.DB_PASS = 'urmomXDDD69';
                process.env.DB_NAME = 'to_urmom_xddd_69';
                assert.deepEqual(rewire(dbIntUrl).__get__('conConfig'),
                        {
                            user: 'postgres',
                            password: 'urmomXDDD69',
                            host: 'localhost',
                            database:'to_urmom_xddd_69'
                        });
            });

            it('should work with all modified vars', () => {
                process.env.DB_USER = 'datBOI';
                process.env.DB_PASS = 'oSH1Twaddup';
                process.env.DB_HOST = 'reddit.com';
                process.env.DB_NAME = 'signMEtheF%CKup';
                assert.deepEqual(rewire(dbIntUrl).__get__('conConfig'),
                        {
                            user: 'datBOI',
                            password: 'oSH1Twaddup',
                            host: 'reddit.com',
                            database: 'signMEtheF%CKup'
                        });
            });
        });
    });
});

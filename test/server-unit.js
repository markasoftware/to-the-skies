"use strict";

const sinon = require('sinon');
const rewire = require('rewire');
const assert = require('chai').assert;
const urls = require('./urls.js');

describe('server unit', () => {
    describe('environment variables check', () => {

        beforeEach(() => {
            ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASS', 'DB_NAME'].forEach((curKey) => {
                delete process.env[curKey];
            });
        });

        describe('connection string', () => {

            it('should have the correct default', () => {
                assert.deepEqual(rewire(urls.dbInt).__get__('conConfig'),
                        {
                            user: 'to_the_skies',
                            password: 'password',
                            host: 'localhost',
                            port: '5432',
                            database: 'to_the_skies_dev'
                        });
            });

            it('should work with some modified vars', () => {
                process.env.DB_PASS = 'urmomXDDD69';
                process.env.DB_NAME = 'to_urmom_xddd_69';
                assert.deepEqual(rewire(urls.dbInt).__get__('conConfig'),
                        {
                            user: 'to_the_skies',
                            password: 'urmomXDDD69',
                            host: 'localhost',
                            port: '5432',
                            database:'to_urmom_xddd_69'
                        });
            });

            it('should work with all modified vars', () => {
                process.env.DB_USER = 'datBOI';
                process.env.DB_PASS = 'oSH1Twaddup';
                process.env.DB_HOST = 'reddit.com';
                process.env.DB_PORT = '6969';
                process.env.DB_NAME = 'signMEtheF%CKup';
                assert.deepEqual(rewire(urls.dbInt).__get__('conConfig'),
                        {
                            user: 'datBOI',
                            password: 'oSH1Twaddup',
                            host: 'reddit.com',
                            port: '6969',
                            database: 'signMEtheF%CKup'
                        });
            });
        });
    });
});

const supertest = require('supertest');
const rewire = require('rewire');
const assert = require('chai').assert;
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const dbIntUrl = '../src/db-interface.js';

//database connection stuff
process.env.DB_NAME = 'to_the_skies_test';

//reset the database to the templatee
function dropDB(done){
    require('child_process').exec("psql -U postgres -c 'DROP DATABASE to_the_skies_test;'", (err, stdout, stderr) => {
        if(err && stderr.indexOf('does not exist') === -1) console.error('An error occuring dropping the database. stderr:' + stderr + ' stdout: ' + stdout);
        done();
    });
}
function createDB(done){
    require('child_process').exec("psql -U postgres -c 'CREATE DATABASE to_the_skies_test TEMPLATE to_the_skies_template'", function(err, stdout, stderr){
        if(err) console.error('An error occured creating the database. stderr: ' + stderr + ' stdout: ' + stdout);
        done();
    });
}
function resetDB(done){
    dropDB(() => {
        createDB(done);
    });
}

describe('database', () => {

    let dbInt = rewire(dbIntUrl);

    before(resetDB);

    afterEach(dbInt.terminateConnections);

    it('should be able to connect to the database', async((done) => {
        const row = await(dbInt.__get__('db').one('SELECT COUNT(*) FROM nodes;'));
        assert.isAbove(row.count, 0, 'there should be at least 1 node in the nodes table');
        const row2 = await(dbInt.__get__('db').one('SELECT current_database();'));
        assert.equal(row2.current_database, 'to_the_skies_test', 'current database name');
        done();
    }));
    describe('login', () => {
        
        before(resetDB);

        let lastUserID;

        it('should be able to insert new users', async((done) => {
            //try to login with a new username
            const returnedUserID = await(dbInt.login('133769690000000000000'));
            const row = await(dbInt.__get__('db').one('SELECT * FROM users WHERE googleid=\'133769690000000000000\''));
            assert.equal(row.userid, returnedUserID, 'returned user ID and selected user ID should be the same');
            //better safe than sorry, rite?
            assert.equal(row.googleid, '133769690000000000000', 'googleid is correct');
            lastUserID = returnedUserID;
            done();
        }));
        it('should return the same user id the second time', async((done) => {
            //same googleid as last time
            const row = await(dbInt.__get__('db').one('SELECT userid FROM users WHERE googleid=\'133769690000000000000\''));
            assert.equal(row.userid, lastUserID);
            done();
        }));
        it('should not allow weird-ass google ids', async((done) => {
            try {
                await(dbInt.login('ad,.clgdhpgcdbkcgxbegclu,.cgxbpcgd,.pucgloebcugd,.cgypd'));
            } catch (err) {
                assert.isOk(err);
                return done();
            }
            //if we get here there was no error
            assert.fail(0, 1, 'query should throw an error');
            done();
        }));
    });
});

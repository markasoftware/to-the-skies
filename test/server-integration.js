const supertest = require('supertest');
const rewire = require('rewire');
const assert = require('chai').assert;

const dbIntUrl = '../src/db-interface.js';

//database connection stuff
process.env.DB_NAME = 'to_the_skies_test';

//reset the database to the templatee
function dropDB(done){
    console.log('drop database');
    require('child_process').exec('dropdb to_the_skies_test', (err, stdout, stderr) => {
        if(err && stderr.indexOf('does not exist') === -1) console.error('An error occuring dropping the database. stderr:' + stderr + ' stdout: ' + stdout);
        done();
    });
}
function createDB(done){
    console.log('create database');
    require('child_process').exec('createdb to_the_skies_test --owner to_the_skies_dev --template to_the_skies_template', function(err, stdout, stderr){
        if(err) console.error('An error occured creating the database. stderr: ' + stderr + ' stdout: ' + stdout);
        done();
    });
}
function resetDB(done){
    dropDB(() => {
        createDB(done);
    });
}

describe('server integration',function(){

    before(resetDB);

    describe('database', () => {
        describe('connecting to database', () => {
            it('should be able to connect to the database', (done) => {
                rewire(dbIntUrl).__get__('DBConnect')((dbObj, cb) => {
                    //check that there is at least one line in the nodes table. Good enough
                    dbObj.query('SELECT COUNT(*) FROM nodes;', (err, response) => {
                        if(err) throw 'DB query error: ' + err;
                        assert.isAbove(response.rows[0].count, 0);
                        //for good measure, let's check the DB name
                        dbObj.query('SELECT current_database();', (err, response) => {
                            if(err) throw 'DB query error: ' + err;
                            assert.equal(response.rows[0].current_database, 'to_the_skies_test');
                            cb();
                            done();
                        });
                    });
                });
            });
            /*it('should release the client when callback is called', (done) => {
                rewire(dbIntUrl).__get__('DBConnect')((dbObj, cb) => {
                    cb();
                    //should fail, is returned
                    dbObj.query('SELECT current_database();', (err, response) => {
                        console.log(response);
                        done();
                    });
                });
            });*/
        });
        describe('login', () => {

            after(resetDB);

            it('should be able to insert new users', (done) => {
                const dbInt = rewire(dbIntUrl);
                //try to login with a new username
                dbInt.__get__('login')('
            });
    });

    /*var login = function(agent, done){
        agent
        .get('/auth/google/callback?id=3')
        .expect(302)
        .expect('location', '/')
        .expect('set-cookie', /connect\.sid=.{20,}/i, done);
    }

    var serverApp = require('../src/server.js');

    describe('login, logout, and other related stuff', function(){
        it('should have cookies when logging in', function(done){
            //this will cause other tests to fail, but this one will help isolate issues
            var agent = supertest.agent(serverApp);
            login(agent, done);
        });
        it('should remember the user id', function(done){
            var agent = supertest.agent(serverApp);
            login(agent, function(){
                agent
                .get('/userid')
                .expect(200)
                .expect('3', done);
            });
        });
        it('should be able to logout', function(done){
            var agent = supertest.agent(serverApp);
            login(agent, function(){
                agent
                .get('/auth/logout')
                .expect(200)
                .expect('set-cookie', '', done);
            });
        });
    });*/
});

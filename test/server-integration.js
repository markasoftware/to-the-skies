var supertest = require('supertest');

describe('server integration',function(){

    var login = function(agent, done){
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
    });
});

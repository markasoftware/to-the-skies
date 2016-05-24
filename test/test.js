var assert = require('chai').assert;
var sinon = require('sinon');
require('jsdom-global')();
var fs = require('fs');
var path = require('path');
var supertest = require('supertest');
var pg = require('pg');

//setup database
require('../setup/db.js').setCb(function(){

describe('client side',function(){

var $ = function(){
    return document.querySelector.apply(document, arguments);
}

function readScriptSync(fileName){
    return fs.readFileSync(path.join(__dirname, '../src/public/scripts/', fileName), 'utf8');
}

function clearBody(){
    while(document.body.firstChild) document.body.removeChild(document.body.firstChild);
}

//JSYK, I know that this is a really overkill and unnecessary unit test. It is the first one I ever wrote, so I don't really give a shit. It was a good introduction to the woes of client-side unit testing in JavaScript, and it was fun to write
describe('menu manager', function(){

    var clock = sinon.useFakeTimers();

    eval(readScriptSync('menu-manager.js'));

    beforeEach(function(){
        clearBody();

        var menuIconMock = document.createElement('img');
        menuIconMock.setAttribute('id','menu-icon');
        menuIconMock.style.left = '1em';

        var menuMock = document.createElement('header');
        menuMock.setAttribute('id','menu');
        menuMock.style.left = '-8vw';

        var menuCloseMock = document.createElement('img');
        menuCloseMock.setAttribute('id','menu-close-icon');

        menuMock.appendChild(menuCloseMock);
        document.body.appendChild(menuIconMock);
        document.body.appendChild(menuMock);
    });

    it('should not do anything when not clicked',function(){
        var beforeHTML = document.body.innerHTML;
        menuManager.registerEventListeners();
        clock.tick(5000);
        assert.equal(beforeHTML, document.body.innerHTML);
    });

    it('should move the icon out of view, and then menu into view, when clicked',function(){
        menuManager.registerEventListeners();
        var clickEvent = new Event('click');
        document.getElementById('menu-icon').dispatchEvent(clickEvent);
        //verify that menu icon was moved
        assert.equal(document.getElementById('menu-icon').style.left, '-1.5em');
        assert.notEqual(parseInt(document.getElementById('menu').style.left), 0);
        
        clock.tick(400);

        //verify that menu itself was moved
        assert.equal(parseInt(document.getElementById('menu').style.left), 0);
    });

    after(function(){
        clock.restore();
    });
});

describe('caller',function(){

    it('should call the menu opener',function(){
        var funcMock = sinon.spy();
        var menuManager = {
            registerEventListeners: funcMock
        };
        eval(readScriptSync('index-caller.js'));
        assert(funcMock.called);
    });
});

});

describe('server side',function(){

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
                .expect(200, done);
            });
        });
        it('should not create any more database rows after login')
    });
});

});
var assert = require('chai').assert;
var sinon = require('sinon');
require('jsdom-global')();
var fs = require('fs');
var path = require('path');

describe('client side',function(){

function readScriptSync(fileName){
    return fs.readFileSync(path.join(__dirname, '../src/scripts/', fileName), 'utf8');
}

function clearBody(){
    while(document.body.firstChild) document.body.removeChild(document.body.firstChild);
}

//JSYK, I know that this is a really overkill and unnecessary unit test. It is the first one I ever wrote, so I don't really give a shit. It was a good introduction to the woes of client-side unit testing in JavaScript, and it was fun to write
describe('menu opener', function(){

    var clock = sinon.useFakeTimers();

    eval(readScriptSync('menu-opener.js'));

    beforeEach(function(){
        clearBody();

        var menuIconMock = document.createElement('img');
        menuIconMock.setAttribute('id','menu-icon');
        menuIconMock.style.left = '1em';

        var menuMock = document.createElement('div');
        menuMock.setAttribute('id','menu');
        menuIconMock.style.left = '-8vw';

        document.body.appendChild(menuIconMock);
        document.body.appendChild(menuMock);
    });

    it('should not do anything when not clicked',function(){
        var beforeHTML = document.body.innerHTML;
        menuOpener.registerEventListeners();
        clock.tick(5000);
        assert.equal(beforeHTML, document.body.innerHTML);
    });

    it('should move the icon out of view, and then menu into view, when clicked',function(){
        menuOpener.registerEventListeners();
        var clickEvent = new Event('click');
        document.getElementById('menu-icon').dispatchEvent(clickEvent);
        //verify that menu icon was moved
        assert.equal(document.getElementById('menu-icon').style.left, '-1.5em');
        
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
        var menuOpener = {
            registerEventListeners: funcMock
        };
        eval(readScriptSync('index-caller.js'));
        assert(funcMock.called);
    });
});

});

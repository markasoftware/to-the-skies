const sinon = require('sinon');
const jsdom = require('jsdom');
const fs = require('fs');
const assert = require('chai').assert;

const urls = require('./urls.js');
const lib = require('./lib.js');

//this might be split up into multiple files at some point

describe('client side', () => {

    afterEach(() => {
        if(global.window) {
            delete global.window;
        }
    });

    describe('left menu', () => {

        beforeEach((done) => {
            jsdom.env({
                html: '',
                src: [
                    lib.getRaw(urls.mithril),
                    lib.getRaw(urls.menuView),
                    lib.getRaw(urls.menuCtrl)
                ],
                done: (err, window) => {
                    if(err) throw err;
                    else {
                        global.window = window;
                        done();
                    }
                }
            });
        });

        describe('controller', () => {
            it('should populate this.loggedIn properly', () => {
                window.user = {};
                window.user.get = sinon.stub().returns(false);
                let ctrl = new window.menu.controller();
                assert.isOk(window.user.get.calledOnce);
                assert.equal(ctrl.loggedIn, false);
                window.user.get = sinon.stub().returns(true);
                ctrl = new window.menu.controller();
                assert.isOk(window.user.get.calledOnce);
                assert.equal(ctrl.loggedIn, true);
            });
        });

        describe('view', () => {

            function isRow(row) {
                assert.isOk(row);
                assert.notEqual(row.attrs.className.indexOf('menu-row'), -1);
            }
            function hasTopRow(rows) {
                isRow(rows[0]);
                assert.isOk(rows[0].children[0]);
                assert.equal(rows[0].children[0].tag, 'img');
                assert.equal(rows[0].attrs.id, 'close-icon-row');
            }
            function basicRows(rows) {
                rows.forEach(isRow);
                hasTopRow(rows);
            }

            it('should call the loggedIn getter-setter', () => {
                const loggedIn = sinon.stub().returns(false);
                window.menu.view({loggedIn: loggedIn});
                assert.isOk(loggedIn.calledOnce);
            });
            it('should have close and login rows when not logged in', () => {
                const view = window.menu.view({
                    loggedIn: sinon.stub().returns(false)
                });
                basicRows(view);
                assert.equal(view.length, 2);
                assert.equal(view[1].attrs.id, 'login-row');
                assert.equal(view[1].children.length, 1);
            });
            it('should not have the login row when logged in', () => {
                const view = window.menu.view({
                    loggedIn: sinon.stub().returns(true)
                });
                basicRows(view);
                view.forEach((row) => {
                    assert.notEqual(row.attrs.id, 'login-row');
                });
            });
        });
    });
});

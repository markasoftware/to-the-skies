'use strict';

const storage = require('../models/storage.js');
const characterList = require('../models/character-list.js');
const m = require('mithril');

module.exports = (ctrl) => {
    const toReturn = [
        m('.menu-row#close-icon-row', [
            m('img#menu-close-icon[src=\'images/arrow.svg\']'),
        ]),
    ];
    // if not logged in
    if (!storage.user.get()) {
        toReturn.push(
            m('.menu-row#login-row', [
                m('a[href=\'auth/google/init\']', 'Sign in with Google'),
            ])
        );
    // if logged in
    } else {
        // the characters
        characterList.getAll().forEach((curChar) => {
            toReturn.push(
                m('.menu-row', curChar.name())
            );
        });

        // the new button
        toReturn.push(
            m('.menu-row', [
                m('img[src=\'images/plus.svg\']', {
                    onclick: ctrl.newChar,
                }),
            ])
        );
    }

    return toReturn;
};

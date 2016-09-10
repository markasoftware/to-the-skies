'use strict';

const storage = require('../models/storage.js');
const characterList = require('../models/character-list.js');
const closeMenu = require('../left-menu-opener.js');
const m = require('mithril');

module.exports = (ctrl) => {
    const toReturn = [
        m('.menu-row#close-icon-row', [
            m('img.menu-icon#close-menu-icon[src=\'images/arrow.svg\']', {
                onclick: closeMenu,
            }),
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
        characterList.getAll().forEach((curChar, ind) => {
            const menuRowChildren = [];
            const isClicked = ctrl.clickedChar() === curChar.characterid();

            if (isClicked) {
                menuRowChildren.push(
                    m('img.menu-icon[src=\'images/cancel.svg\']', {
                        onclick: () => characterList.delete(curChar.characterid()),
                    })
                );
            }

            menuRowChildren.push(
                m('span.a.padded-name', {
                    onclick: () => { ctrl.clickedChar(isClicked ? null : curChar.characterid()); },
                }, curChar.name())
            );

            if (isClicked) {
                menuRowChildren.push(
                    m('img.menu-icon[src=\'images/play.svg\']', {
                        onclick: () => characterList.select(curChar.characterid()),
                    })
                );
            }

            toReturn.push(
                m('.menu-row', {
                    style: {
                        order: curChar.position(),
                    },
                    key: curChar.characterid(),
                }, menuRowChildren)
            );
        });

        // has the + button been clicked?
        if (ctrl.creating()) {
            toReturn.push(
                m('.menu-row', [
                    m('input#create-input-field'),
                    m('img.menu-icon[src=\'images/play.svg\']', {
                        onclick: ctrl.finishNewCharacter,
                    }),
                ])
            );
        // if not, provide the + button
        } else {
            toReturn.push(
                m('.menu-row', { style: { order: 1000 } }, [
                    m('img.menu-icon#new-character-icon[src=\'images/plus.svg\']', {
                        onclick: ctrl.startNewCharacter,
                    }),
                ])
            );
        }
    }

    return toReturn;
};

'use strict';

const m = require('mithril');

module.exports = (data) => {
    console.log(data());
    if (data().notSelected) {
        return m('#not-selected-wrapper', [
            m('h1', 'Select a character to continue'),
            m('h2', 'Use the left menu'),
        ]);
    }
    return m('#selected-wrapper', [
        m('h1', data().content),
        m('#options-wrapper',
            data().options.map((cur, ind, opts) => {
                let classes = '.a.option';
                switch (ind) {
                case 0:
                    classes += '.top.left';
                    break;
                case 1:
                    if (opts.length === 2) {
                        classes += '.top.right';
                    } else {
                        classes += '.top.center';
                    }
                    break;
                case 2:
                    classes += '.top.right';
                    break;
                case 3:
                    if (opts.length === 4) {
                        classes += '.bottom.center';
                    } else {
                        classes += '.bottom.left';
                    }
                    break;
                case 4:
                    if (opts.length === 5) {
                        classes += '.bottom.right';
                    } else {
                        classes += '.bottom.center';
                    }
                    break;
                case 5:
                    classes += '.bottom.right';
                    break;
                }
                return m(classes, cur.content);
            })
        ),
    ]);
};

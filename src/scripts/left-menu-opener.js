'use strict';

const leftMenu = document.getElementById('left-menu');
const leftMenuBtn = document.getElementById('left-menu-button');
leftMenuBtn.addEventListener('click', () => {
    leftMenuBtn.classList.add('hidden-button');
    setTimeout(() =>
        leftMenu.classList.remove('hidden-menu'),
        300
    );
});

module.exports = () => {
    leftMenu.classList.add('hidden-menu');
    setTimeout(() =>
        leftMenuBtn.classList.remove('hidden-button'),
        300
    );
};

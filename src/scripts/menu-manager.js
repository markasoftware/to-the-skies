'use strict';

const menuIcon = document.getElementById('menu-icon');
const menu = document.getElementById('menu');
const menuCloseIcon = document.getElementById('menu-close-icon');

menuIcon.addEventListener('click', () => {
    menuIcon.style.left = '-1.5em';
    setTimeout(() => {
        menu.style.left = '0';
    }, 400);
});

menuCloseIcon.addEventListener('click', () => {
    menu.style.left = '-16vw';
    setTimeout(() => {
        menuIcon.style.left = '1.5em';
    }, 400);
});

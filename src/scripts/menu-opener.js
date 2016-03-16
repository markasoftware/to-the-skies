var menuOpener = {
    registerEventListeners: function(){
        var menuIcon = document.getElementById('menu-icon');
        var menu = document.getElementById('menu');
        menuIcon.addEventListener('click',function(){
            menuIcon.style.left = '-1.5em';
            menu.style.left = '0';
        });
    }
}

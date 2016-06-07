var menuManager = {
    registerEventListeners: function(){
        var menuIcon = document.getElementById('menu-icon');
        var menu = document.getElementById('menu');
        var menuCloseIcon = document.getElementById('menu-close-icon');

        menuIcon.addEventListener('click',function(){
            menuIcon.style.left = '-1.5em';
            setTimeout(function(){
                menu.style.left = '0';
            },400);
        });

        menuCloseIcon.addEventListener('click',function(){
            menu.style.left = '-16vw';
            setTimeout(function(){
                menuIcon.style.left = '1.5em';
            },400);
        });
    }
}

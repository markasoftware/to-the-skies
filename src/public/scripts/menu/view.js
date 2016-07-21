menu = {};

menu.view = function(ctrl) {
    var toReturn = [
        m('.menu-row#close-icon-row', [
            m('img#menu-close-icon[src=\'images/arrow.svg\']')
        ])
    ];
    if(!ctrl.loggedIn()) {
        toReturn.push(
            m('.menu-row#login-row', [
                m('a[href=\'auth/google/init\']')
            ])
        );
    }

    if(ctrl.loggedIn()) {
        ctrl.characterList().forEach(function( curChar ) {
            toReturn.push( m.component( character, curChar ) );
        });
    }
    
    return toReturn;
}

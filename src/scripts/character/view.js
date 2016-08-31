var character = character || {};

character.view = function(ctrl) {
    return m('.menu-row', [
        m('span.a', {
                onclick: ctrl.selectCharacter(),
                style: {
                    flexPosition: ctrl.position(),
                },
                key: ctrl.characterid()
            },
            ctrl.name()
         )
    ]);
}

var characters = {};

characters.Character = function(data) {
    this.name = data.name;
}

characters.storage = {
    get: function() {
        return m.request({method: 'GET', url: 'api/characters'});
    },
    create: function(data) {
        return m.request({method: 'POST', url: 'api/characters', data: data});
    },
    update: function(data) {
        return m.request({method: 'PATCH', url: 'api/characters', data: data})
    }
}

characters.view = function(ctrl) {
    var rows = [];
    ctrl.characterList.forEach(function(curCharacter) {
        rows.push(
            m('div.menu-row', [
                m('span.a', {onclick: 
    });
}

m.mount(document.querySelector('nav'), characters);

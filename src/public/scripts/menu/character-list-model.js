var characterList = {};

(function() {
    var staticCharList = m.prop();
    characterList.get = function() {
        // if it doesnt already exist, populate it
        if(!staticCharList()) {
            storage.characters.getAll().then(staticCharList);
        }
        return staticCharList;
    }
})();

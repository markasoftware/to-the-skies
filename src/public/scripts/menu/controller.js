menu.controller = function(){
    this.loggedIn = storage.user.get();
    if(this.loggedIn())
        this.characterList = storage.characters.get();
}

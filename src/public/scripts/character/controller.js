var character = character || {};

character.controller = function(data) {
    this.name = data.name;
    this.position = data.position;
    this.characterid = data.characterid;
    this.selectCharacter = function(){};
}

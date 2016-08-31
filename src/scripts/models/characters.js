'use strict';

class Character {
    constructor(data) {
        this.name = m.prop(data.name);
        this.position = m.prop(data.position);
        this.characterid = m.prop(data.characterid);
    }
}

class CharacterList extends Array {
    constructor(data) {
        super();

        data.forEach((curChar, ind) => {
            this[ind] = new Character(curChar);
        });
    }

    newChar(name, id) {
        const positionsArr = this.map((k) => k.position);
        const nextPosition = Math.max(...positionsArr) + 1;
    }
}

const characterList = new CharacterList(

const supertest = require('supertest');
const rewire = require('rewire');
const assert = require('chai').assert;
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const urls = require('./urls.js');

const lib = require('./lib.js');

//reset the database to the template

describe('database', () => {

    let dbInt = rewire(urls.dbInt);
    const db = dbInt.__get__('db');

    before(lib.resetDB);

    afterEach(dbInt.terminateConnections);

    it('should be able to connect to the database', async(() => {
        const row = await(dbInt.__get__('db').one('SELECT COUNT(*) FROM nodes;'));
        assert.isOk(row.count, 'should have a result in the row');
        const row2 = await(dbInt.__get__('db').one('SELECT current_database();'));
        assert.equal(row2.current_database, 'to_the_skies_test', 'current database name');
    }));

    ////////////////////////////
    ////////////////////////////
    ////////////////////////////
    describe('login', () => {

        before(lib.resetDB);

        let lastUserID;

        it('should be able to insert new users', async(() => {
            //try to login with a new username
            const returnedUserID = await(dbInt.login('133769690000000000000'));
            const row = await(dbInt.__get__('db').one('SELECT * FROM users WHERE googleid=\'133769690000000000000\''));
            assert.equal(row.userid, returnedUserID, 'returned user ID and selected user ID should be the same');
            //better safe than sorry, rite?
            assert.equal(row.googleid, '133769690000000000000', 'googleid is correct');
            lastUserID = returnedUserID;
        }));

        it('should return the same user id the second time', async(() => {
            //same googleid as last time
            const returnedUserID = await(dbInt.login('133769690000000000000'));
            assert.equal(returnedUserID, lastUserID);
        }));

        it('should not allow long google ids', async(() => {
            try {
                await(dbInt.login('ad,.clgdhpgcdbkcgxbegclu,.cgxbpcgd,.pucgloebcugd,.cgypd'));
            } catch (err) {
                assert.isOk(err);
                return;
            }
            assert.fail(0, 1, 'didn\'t throw error');
        }));
        
        it('should not allow short google ids', async(() => {
            try {
                await(dbInt.login('hcroedu'));
            } catch (err) {
                assert.isOk(err);
                return;
            }
            assert.fail(0, 1, 'didn\'t throw error');
        }));

        it('should not allow blank google ids', async(() => {
            try {
                await(dbInt.login());
            } catch (err) {
                assert.isOk(err);
                return;
            }
            assert.fail(0, 1, 'didn\'t throw error');
        }));

        it('should not allow non-string google ids', async(() => {
            //21 terms long, so length will make it think it's valid
            try {
                await(dbInt.login([1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1]));
            } catch (err) {
                assert.isOk(err);
                return;
            }
            assert.fail(0, 1, 'didn\'t throw error');
        }));
    });
    
    ///////////////////////////
    ///////////////////////////
    ///////////////////////////
    describe('characters', () => {
        describe('get', () => {

            before(async(function(){
                this.timeout(5000);
                await(lib.resetDBPromise());
                await(db.none(
                    "INSERT INTO users (googleid) VALUES ('123456789012345678901');"
                ));
                await(db.none(
                    "INSERT INTO users (googleid) VALUES ('098765432109876543210');"
                ));
                await(db.none(
                    "INSERT INTO characters (userid, name, position) VALUES (2, 'Mark', 1);"
                ));
                await(db.none(
                    "INSERT INTO characters (userid, name, position) VALUES (2, 'Bl0@pMeUp', 2);"
                ));
                await(db.none(
                    "INSERT INTO characters (userid, name, position) VALUES (2, 'datboi', 3);"
                ));
            }));

            it('should return an array', async(() => {
                const charList = await(dbInt.characters.get('2'));
                assert.isArray(charList);
            }));
            it('should get the right number of characters', async(() => {
                const charList = await(dbInt.characters.get('2'));
                assert.equal(charList.length, 3);
            }));
            it('should get the correct characters', async(() => {
                const charList = await(dbInt.characters.get('2'));
                assert.equal(charList[0].name, 'Mark');
                assert.equal(charList[1].name, 'Bl0@pMeUp');
                assert.equal(charList[2].name, 'datboi');
                assert.equal(charList[0].position, '1');
                assert.equal(charList[1].position, '2');
                assert.equal(charList[2].position, '3');
            }));
            it('should not give any characters for a user without any', async(() => {
                const charList = await(dbInt.characters.get('3'));
                assert.deepEqual(charList, []);
            }));
        });

        describe('insert', () => {

            before(lib.resetDB);

            it('should have basic insertion capabilities', async(() => {
                const userID = await(lib.newUser(db));
                await(dbInt.characters.insert(userID, 'iarecat'));
                const catRow = await(db.one("SELECT * FROM characters WHERE name = 'iarecat';"));
                assert.equal(catRow.name, 'iarecat');
                assert.equal(catRow.userid, userID);
                assert.equal(catRow.nodeid, '1');
            }));
            it('should return the character id', async(() => {
                const userID = await(lib.newUser(db));
                const returnedID = await(dbInt.characters.insert(userID, 'whatisafupa'));
                const realID = await(db.one(
                    "SELECT characterid FROM characters WHERE name = 'whatisafupa';"
                )).characterid;
                assert.equal(returnedID, realID);
            }));
                  
            it('should start at position 1', async(() => {
                const userID = await(lib.newUser(db));
                await(dbInt.characters.insert(userID, 'iaredatboi'));
                const datboiRow = await(db.one("SELECT * FROM characters WHERE name = 'iaredatboi'"));
                assert.equal(datboiRow.position, 0);
            }));
            it('should use incrementing positions', async(() => {
                const userID = await(lib.newUser(db));
                await(dbInt.characters.insert(userID, 'isaacasimov'));
                await(dbInt.characters.insert(userID, 'arthurclarke'));
                await(dbInt.characters.insert(userID, 'drseuss'));
                const arthurPos = await(db.one("SELECT position FROM characters WHERE name = 'arthurclarke';")).position;
                const seussPos = await(db.one("SELECT position FROM characters WHERE name = 'drseuss';")).position;
                assert.equal(arthurPos, 1);
                assert.equal(seussPos, 2);
            }));
        });
    });
});

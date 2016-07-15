-- create basic structure
CREATE TABLE users (
    userid serial PRIMARY KEY,
    googleid char(21) NOT NULL UNIQUE
);
CREATE TABLE nodes (
    nodeid serial PRIMARY KEY,
    userid int NOT NULL REFERENCES users (userid),
    content varchar(100) NOT NULL,
    opt1 varchar(45) NOT NULL,
    opt2 varchar(45) NOT NULL
);
CREATE TABLE characters (
    characterid serial PRIMARY KEY,
    userid int NOT NULL REFERENCES users (userid),
    position int NOT NULL,
    name varchar(30) NOT NULL,
    nodeid int NOT NULL DEFAULT 1 REFERENCES nodes (nodeid)
);

-- insert dummy data
INSERT INTO users (googleid) VALUES ('000000000000000000000');
INSERT INTO nodes (userid, content, opt1, opt2) VALUES (1, 'Hello', 'Yes', 'Ni Hao');

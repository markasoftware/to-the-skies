-- create basic structure
CREATE TABLE users (
    userid serial PRIMARY KEY,
    googleid char(21) NOT NULL UNIQUE
);
CREATE TABLE nodes (
    nodeid serial PRIMARY KEY,
    content varchar(140) NOT NULL,
    opt1 varchar(40) NOT NULL,
    opt2 varchar(40) NOT NULL
);
CREATE TABLE characters (
    characterid serial PRIMARY KEY,
    userid int NOT NULL REFERENCES users (userid),
    name varchar(30),
    curnode int NOT NULL DEFAULT 1 REFERENCES nodes (nodeid)
);

-- insert dummy data
INSERT INTO nodes (content, opt1, opt2) VALUES ('Hello', 'Yes', 'Ni Hao');

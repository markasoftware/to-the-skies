-- create basic structure
CREATE TABLE users (
    userid serial PRIMARY KEY,
    googleid char(21) NOT NULL UNIQUE
);
CREATE TABLE paths (
    pathid serial PRIMARY KEY,
    userid int NOT NULL REFERENCES users (userid),
    name varchar(30) NOT NULL,
    published boolean NOT NULL DEFAULT FALSE
);
CREATE TABLE nodes (
    nodeid serial PRIMARY KEY,
    pathid int NOT NULL REFERENCES paths (pathid),
    content varchar(150) NOT NULL
);
CREATE TABLE options (
    optionid serial PRIMARY KEY,
    nodeid int NOT NULL REFERENCES nodes (nodeid),
    content varchar(60) NOT NULL
);
CREATE TABLE node_coordinates (
    pathid int NOT NULL REFERENCES paths (pathid),
    nodeid int NOT NULL REFERENCES nodes (nodeid),
    xpos int NOT NULL,
    ypos int NOT NULL
);
CREATE TABLE node_connections (
    optionid int NOT NULL,
    out_nodeid int NOT NULL REFERENCES nodes (nodeid)
);
CREATE TABLE characters (
    characterid serial PRIMARY KEY,
    userid int NOT NULL REFERENCES users (userid),
    position int NOT NULL,
    name varchar(30) NOT NULL,
    nodeid int NOT NULL DEFAULT 1 REFERENCES nodes (nodeid)
);

-- insert initial node
INSERT INTO users (googleid) VALUES ('000000000000000000000');
INSERT INTO paths (userid, name) VALUES (1, 'Default Path');
INSERT INTO nodes (pathid, content) VALUES (1,
    'The ship floats upwards, to the skies.'
);
INSERT INTO options (nodeid, content) VALUES (1,
    'This is option 1'
);
INSERT INTO options (nodeid, content) VALUES (1,
    'This is option 2'
);

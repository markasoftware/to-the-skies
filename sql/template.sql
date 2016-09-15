-- create basic structure
CREATE TABLE users (
    userid serial PRIMARY KEY,
    googleid char(21) NOT NULL UNIQUE
);
CREATE TABLE paths (
    pathid serial PRIMARY KEY,
    userid int NOT NULL REFERENCES users (userid),
    name varchar(30) NOT NULL
);
CREATE TABLE nodes (
    nodeid serial PRIMARY KEY,
    pathid int NOT NULL REFERENCES paths (pathid),
    content varchar(150) NOT NULL,
    options varchar(60)[] CHECK (array_length(options, 1) < 7) NOT NULL
);
CREATE TABLE node_coordinates (
    nodeid int NOT NULL REFERENCES nodes (nodeid),
    xpos int NOT NULL,
    ypos int NOT NULL
);
CREATE TABLE node_connections (
    in_nodeid int NOT NULL REFERENCES nodes (nodeid),
    in_option_index int NOT NULL,
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
INSERT INTO nodes (pathid, content, options) VALUES (1,
    'The ship floats upwards, to the skies.',
    ARRAY['This is option 1', 'This is option 2']
);

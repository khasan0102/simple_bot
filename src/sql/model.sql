CREATE TABLE users(
    chat_id VARCHAR(32) NOT NULL PRIMARY KEY,
    username VARCHAR(32),
    phone_number VARCHAR(32),
    age SMALLINT,
    step smallint DEFAULT 1,
    role smallint default 2
);
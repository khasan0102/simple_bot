create extension if not exists "uuid-ossp";

CREATE TABLE users(
    chat_id VARCHAR(32) NOT NULL PRIMARY KEY,
    username VARCHAR(32),
    phone_number VARCHAR(32),
    age SMALLINT,
    step smallint DEFAULT 1,
    role smallint default 2,
    user_cv VARCHAR(256) NULL,
    user_description TEXT
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN user_cv VARCHAR(64);
ALTER TABLE users ADD COLUMN user_description VARCHAR(64);

CREATE TABLE users_comments(
    user_comment_id uuid not null default uuid_generate_v4() primary key,
    user_comment TEXT NOT NULL,
    chat_id VARCHAR(32) NOT NULL REFERENCES users(chat_id) ON DELETE CASCADE
);

INSERT INTO users (chat_id, username, phone_number)
VALUES ('123009213', 'Sayfullo', '+998998616951');
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL primary key,
    first VARCHAR(255),
    last VARCHAR(255),
    email VARCHAR (255) UNIQUE,
    password text,
    image VARCHAR(255),
    bio text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS friendships;

CREATE TABLE friendships(
    id SERIAL,
    sender_id INT REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    accepted BOOLEAN DEFAULT false
);

DROP TABLE IF EXISTS chats;

CREATE TABLE chats(
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id),
    message VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

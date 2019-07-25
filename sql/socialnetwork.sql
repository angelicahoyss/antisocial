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

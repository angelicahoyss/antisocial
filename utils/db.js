let spicedPg = require("spiced-pg");
let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:postgres:postgres@localhost:5432/socialnetwork");
}

exports.addUserInfo = function addUserInfo(first, last, email, password) {
    return db.query(
        `INSERT INTO users(first, last, email, password) VALUES($1, $2, $3, $4) RETURNING id`,
        [first, last, email, password]
    );
};

exports.getUser = function getUser(email) {
    return db.query(`SELECT * FROM users WHERE email=$1`, [email]);
};

exports.getUserById = function getUserById(id) {
    return db.query(
        `SELECT id, first, last, image, bio FROM users WHERE id=$1`,
        [id]
    );
};

exports.addImage = function addImage(image, id) {
    return db.query(`UPDATE users SET image = $1 WHERE id = $2 RETURNING *`, [
        image,
        id
    ]);
};

exports.addBio = function addBio(bio, id) {
    return db.query(`UPDATE users SET bio = $1 WHERE id = $2 RETURNING bio`, [
        bio,
        id
    ]);
};

exports.searchUsers = function searchUsers(val) {
    return db.query(
        `SELECT id, first, last, image FROM users WHERE first ILIKE $1;`,
        [val + '%']
    );
}

exports.getRecentUsers = function getRecentUsers() {
    return db.query(
        `SELECT id, first, last, image, bio FROM users ORDER BY created_at DESC LIMIT 3`
    );
};

exports.getFriendships = function getFriendships() {
    return db.query(
        `SELECT * FROM friendships
        WHERE (sender_id = $1 AND recever_id = $2)
        OR (sender_id = $2 AND recever_id = $1)`
    );
};

exports.addFriendship = function addFriendship(sender, receiver) {
    return db.query(
        `INSERT into friendships(sender_id, receiver_id, accepted)
        VALUES ($1, $2, $3)
        RETURNING sender_id, receiver_id. accepted`,
        [sender, receiver]
    );
};

exports.acceptFriendship = function acceptFriendship(sender, receiver) {
    return db.query(
        `UPDATE friendships
        SET accepted = true
        WHERE sender_id = $2 AND reciever_id = $1
        RETURNING accepted
        `,
        [sender, receiver]
    );
};

exports.cancelFriendship = function cancelFriendship(sender, receiver) {
    return db.query(
        `DELETE FROM friendships
        WHERE (sender_id = $1 AND reciever_id = $2)
        OR (sender_id = $2 AND reciever_id = $1)`,
        [sender, receiver]
    );
};

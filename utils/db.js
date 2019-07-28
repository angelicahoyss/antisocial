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

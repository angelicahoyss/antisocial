let spicedPg = require("spiced-pg");
let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:postgres:postgres@localhost:5432/socialnetwork");
}

exports.addUserInfo = function addUserInfo(first, last, email, password) {
    return db.query(
        "INSERT INTO users(first, last, email, password) VALUES($1, $2, $3, $4) RETURNING id",
        [first, last, email, password]
    );
};

exports.getUser = function getUser(email) {
    return db.query(`SELECT * FROM users WHERE email=$1`, [email]);
};

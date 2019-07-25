const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./utils/db");
const bcrypt = require("./utils/bc");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const s3 = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const config = require("./config");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(compression());
app.use(bodyParser.json());
app.use(express.static("./public"));

app.use(
    cookieSession({
        secret: "I'm always angry.",
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", async (req, res) => {
    const { first, last, email, password } = req.body;

    try {
        let hash = await bcrypt.hashPassword(password);
        let id = await db.addUserInfo(first, last, email, hash);
        req.session.userId = id.rows[0].id;
        res.json({ success: true });
    } catch (err) {
        console.log("err in POST /register", err);
    }
});

app.post("/login", (req, res) => {
    db.getUser(req.body.email).then(results => {
        // console.log("/login:", results);
        console.log("results.rows:", results.rows[0]);
        if (!results.rows[0]) {
            res.json({
                success: false
            });
        }
        return bcrypt
            .checkPassword(req.body.password, results.rows[0].password)
            .then(match => {
                // console.log("body.password", req.body.password);
                // console.log("database pass", results.rows[0].password);
                if (match === true) {
                    // console.log("hash pass:", results.rows[0].password);
                    req.session.userId = results.rows[0].id;
                    res.json({
                        success: true
                    });
                } else {
                    res.json({
                        success: false
                    });
                }
            })
            .catch(err => {
                console.log("post /login error ", err);
            });
    });
});

app.post("/upload", uploader.single("file"), s3.upload, async (req, res) => {
    const image = config.s3Url + req.file.filename;

    try {
        const data = await db.addImage(image, req.session.userId);
        console.log("data.URL in index POST upload:", data);
        res.json(data.rows[0].image);
    } catch (err) {
        console.log("err in POST / upload", err);
    }
});

//show default image if there is none
app.get("/user", async (req, res) => {
    try {
        let user = await db.getUserById(req.session.userId);
        // user = user.rows[0];
        // console.log("user:", user.rows[0]);

        if (user.rows[0].image === null) {
            user.rows[0].image = "/images/default.jpg";
        }
        // console.log("USER.ROWS[0]:", user.rows[0]);
        // console.log("USER URL:", user.rows[0].image);
        res.json(user.rows[0]);
    } catch (err) {
        console.log("err in GET / user", err);
    }

});

app.post("/bio", async (req, res) => {
    try {
        await db.addBio(req.body.bio, req.session.userId);
        res.json(req.body.bio);
    } catch (err) {
        console.log("err in POST / bio", err);
    }
});

app.get("/user/:id.json", async (req, res) => {
    try {
        const { id } = req.params;
        if (id == req.session.userId) {
            res.json({
                error: true,
                sameUser: true
            });
        }
        const results = await db.getUserById(id);
        res.json(results.rows[0]);
    } catch (err) {
        console.log("err in GET / user/:id.json", err);
    }

});

app.get("/users", (req, res) => {
    db.getRecentUsers()
        .then(results => {
            // console.log("results in getRecentUsers:", results);
            res.json(results.rows);
        })
        .catch(err => {
            console.log("err in GET /users: ", err);
        });
});

app.post("/users.json", (req, res) => {
    db.searchUsers(req.body.val).then(results => {
        res.json(results.rows);
    }).catch(err => {
        console.log("err in POST /search: ", err);
        res.json({
            error: true
        });
    });
});

app.get("friendshipstatus/:id.json", (req, res) => {
    db.getFriendships(req.session.userId, req.params.id)
    }).then(results => {
        if (!results.rows[0]) {
            res.json({
                sender_id: req.session.userId,
                receiver_id: req.params.id,
                accepted: false
            });
        } else {
            res.json({
                results.rows[0]
            });
        }
    }).catch(err => {
        console.log("err in GET /friendshipstatus: ", err);
});


//--------DO NOT DELETE THIS --------------
app.get("*", (req, res) => {
    if (!req.session.userId && req.url != "/welcome") {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
//--------DO NOT DELETE THIS --------------

app.listen(8080, function() {
    console.log("I'm listening.");
});

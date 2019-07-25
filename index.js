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

//show default image if there is none
app.get("/user", async (req, res) => {
    let user = await db.getUserById(req.session.userId);
    // user = user.rows[0];
    // console.log("user:", user.rows[0]);

    if (user.rows[0].image === null) {
        user.rows[0].image = "/images/default.jpg";
    }
    res.json({ user });
});

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
        req.session.userId = id;
        res.json({ success: true });
    } catch (err) {
        console.log("err in POST /register", err);
    }
});
//     console.log("request: ", req);
//     console.log("password: ", req.body.password);
//     bcrypt.hashPassword(req.body.password).then(hash => {
//         return db
//             .addUserInfo(req.body.first, req.body.last, req.body.email, hash)
//             .then(results => {
//                 //id
//                 req.session.userId = results.rows[0].id;
//                 res.json({ loggedIn: true }); //success
//             })
//             .catch(err => {
//                 console.log("err in addUserInfo: ", err);
//             });
//     });

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

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    const url = config.s3Url + req.file.filename;
    // console.log("URL :", url);
    db.addImage(req.session.userId, url)
        .then(data => {
            res.json(data.rows[0]);
        })
        .catch(err => {
            console.log("err in POST / uploadFile", err);
        });
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

//3 components: 1. profile pic, 2. uploader(modal ui for uploading a file) and 3. wrapper called App, single component we pass to react.render
//3. component will contain profile pic and uploader and a router in part 5.
//modal should disable background so users can only upload or x
//uploader will create form data, paste multer stuff in inxdex.js, s3 stuff, identical to imageboard except one difference
//after s3 is done in imageboard we were inserting new table, instead, here we will do update query to set image req.session.user = newUrl
//uploader makes new ajax request, append file only
//as soon as you click on image it should be uploaded onChange handler on the input field. object fit center

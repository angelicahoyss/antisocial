const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./utils/db");
const bcrypt = require("./utils/bc");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const csurf = require("csurf");

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

// app.get("/get-animal", (req, res) => {
//     res.json({
//         name: "Zebra",
//         cutenessScore: "pretty cute"
//     });
// });
//--------DO NOT DELETE THIS --------------
app.get("*", (req, res) => {
    if (!req.session.userId && req.url != "/welcome") {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
//--------DO NOT DELETE THIS --------------

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
        console.log("err in POST /register");
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

app.listen(8080, function() {
    console.log("I'm listening.");
});

//token on petition it was in all input fields on post requests.

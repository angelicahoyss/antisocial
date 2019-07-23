const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./utils/db");
const bcrypt = require("./utils/bc");
const bodyParser = require("body-parser");

app.use(compression());
app.use(bodyParser.json());
app.use(express.static("./public"));

// require cookie session

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
app.get("/welcome", (req, res) => {
    res.json({});
});

app.post("/register", (req, res) => {
    bcrypt.hashPassword(req.body.password).then(hash => {
        return db
            .addUserInfo(req.body.first, req.body.last, req.body.email, hash)
            .then(results => {
                res.json({});
            })
            .catch(err => {
                console.log("err in addUserInfo: ", err);
            });
    });
});

// /welcome
app.get("*", function(req, res) {
    // if (!req.session.userId) {
    //     res.redirect("/");
    // } else {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function() {
    console.log("I'm listening.");
});

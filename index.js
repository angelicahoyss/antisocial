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
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });

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

// app.use(
//     cookieSession({
//         secret: "I'm always angry.",
//         maxAge: 1000 * 60 * 60 * 24 * 14
//     })
// );

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
    db.searchUsers(req.body.val)
        .then(results => {
            res.json(results.rows);
        })
        .catch(err => {
            console.log("err in POST /search: ", err);
            res.json({
                error: true
            });
        });
});

app.get("/friendship/:otherProfileId.json", async (req, res) => {
    try {
        const results = await db.getFriendships(
            req.session.userId,
            req.params.otherProfileId
        );
        if (!results.rows[0]) {
            res.json({
                btnText: "add friend"
            });
        } else if (results.rows[0].accepted) {
            res.json({
                btnText: "unfriend"
            });
        } else if (results.rows[0].sender_id == req.params.otherProfileId) {
            res.json({
                btnText: "accept friend request"
            });
        } else {
            res.json({
                btnText: "cancel friend request"
            });
        }
    } catch (err) {
        console.log("err in GET /friendship: ", err);
    }
});

app.post("/friendrequest/:otherProfileId.json", async (req, res) => {
    try {
        if (req.body.button == "add friend") {
            await db.addFriendship(
                req.session.userId,
                req.params.otherProfileId
            );
            res.json({
                btnText: "cancel friend request"
            });
        }
    } catch (err) {
        console.log("err in POST /friendrequest: ", err);
    }
});

app.post("/acceptfriend/:otherProfileId.json", async (req, res) => {
    console.log("index post request for acceptfriend")
    try {
        if (req.body.button == "accept friend request") {
            console.log("index conditional for acceptrequest")
            await db.acceptFriendship(
                req.session.userId,
                req.params.otherProfileId
            );
            res.json({
                btnText: "unfriend"
            });
        }
    } catch (err) {
        console.log("error in POST /acceptfriend: ", err);
    }
});

app.post("/unfriend/:otherProfileId.json", async (req, res) => {
    try {
        if (req.body.button == "unfriend") {
            await db.cancelFriendship(
                req.session.userId,
                req.params.otherProfileId
            );
            res.json({
                btnText: "add friend"
            });
        }
    } catch (err) {
        console.log("err in POST /unfriend: ", err);
    }
});

app.post("/cancelrequest/:otherProfileId.json", async (req, res) => {
    try {
        if (req.body.button == "cancel friend request") {
            await db.cancelFriendship(
                req.session.userId,
                req.params.otherProfileId
            );
            res.json({
                btnText: "add friend"
            });
        }
    } catch (err) {
        console.log("err in POST /cancelrequest: ", err);
    }
});

app.get("/friendswannabes", async (req, res) => {
    try {
        const { rows } = await db.friendsWannabes(req.session.userId);
        res.json(rows);
    } catch (err) {
        console.log("err in GET /friendswannabes: ", err);
    }
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

//------SERVER SIDE SOCKET CODE------------

io.on('connection', function(socket) {
    console.log(`a socket with the id ${socket.id} just connected`);
    const userId = socket.request.session.userId;
    if (!userId) {
        return socket.disconnect(true);
    }
});

/////PART 9/////

// socket.on('my amazing chat message', msg => {
//     console.log(`got message from front end.
//         about to do the whole redux thing.
//         my message ${msg}`);
// });
// //getting the last 10 chat messages.
// // db.lastTenMessages().then(data=> {
// //     //we have last 10 chats. new table for chats!!
// //     socket.emit('chatMessages', data.rows)
// // }).catch(err=>console.log(err));
//
// //part 2 is dealing with a new chat message.
// socket.on('newMessage', function() {
//     console.log('this is the new chat message', newMessage);
//     //figure out who sent message.
//     //then make db query to get info about that user.
//     //THEN create a new message Object that matches the object in the last 10
//     //chat messages
//
//     //emit that there is a new chat and pass the object.
//     //add this chat message to our database.
// });

//------SERVER SIDE SOCKET CODE ENDS ------------

// -----david's encounter-----
// let mySocketId;

// const onlineUsers = {};

// io.on('connection', socket => {
//     console.log(`a socket with the id ${socket.id} just connected`);
//
//     console.log(
//         socket.request.headers //to know the id of the user
//     );
//
//     socket.emit('greeting', {
//         message: 'hey there, good looking'
//     });
//
//     io.emit('newPlayer', {});
//     io.sockets.emit('newPlayer', {});
//
//     // if (mySocketId) {
//     //     io.sockets.sockets[mySocketId].emit('targetedMessage');
//     // }
//
    // mySocketId = socket.id;
//
//     socket.on('niceToBeHere',
//         payload => console.log(payload)
//     );

//      const onlineUserId = Object.values(onlineUsers);
//
//     socket.on('disconnect', () => {
//          delete onlineUsers[socket.id];
//         // console.log(`a socket with the id ${socket.id} just disconnected`);
//     });
// });

server.listen(8080, function() {
    console.log("I'm listening.");
});

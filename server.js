const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const users = require("./controllers/users");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "krunalhingu",
    password: "6thvad9om",
    database: "brain-db",
  },
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

/* ROOT */
app.get("/", users.handleUsers(db));

/* SIGNIN */
app.post("/signin", signin.handleSignin(db, bcrypt));

/* REGISTER */
app.post("/register", register.handleRegister(db, bcrypt));

/* PROFILE BY ID */
app.get("/profile/:id", profile.handleProfileGet(db));

/* USER RANK */
app.put("/image", image.handleImage(db));

/* clarifai api call */
app.post("/imageurl", image.handleApiCall(db));

app.listen(3000, () => {
  console.log("Server running now");
});

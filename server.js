const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "krunalhingu",
    password: "6thvad9om",
    database: "brain-db",
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

const app = express();

app.use(bodyParser.json());
app.use(cors());

/* ROOT */
app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.json(400).json("error getting users"));
});

/* SIGNIN */
app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValidLogin = bcrypt.compareSync(req.body.password, data[0].hash);

      if (isValidLogin) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
});

/* REGISTER */
app.post("/register", (req, res) => {
  const counter = 0;
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));
});

/* PROFILE BY ID */
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let isFound = false;

  db.select("*")
    .from("users")
    .where({
      id: id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("can't find user");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));
});

/* USER RANK */
app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("enteries", 1)
    .returning("enteries")
    .then((enteries) => {
      res.json(enteries[0]);
    })
    .catch((err) => res.status(400).json("unable to get enteries"));
});

app.listen(3000, () => {
  console.log("Server running now");
});

/* 

/ ---> this is working
/signin ---> POST , success/fail
/register ---> POST , user
/profile/:userid ---> GET , user
/image ---> PUT , user

*/

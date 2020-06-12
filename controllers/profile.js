const handleProfileGet = (db) => (req, res) => {
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
};

module.exports = {
  handleProfileGet: handleProfileGet,
};

const handleUsers = (db) => (req, res) => {
  db.select("*")
    .from("users")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.json(400).json("error getting users"));
};

module.exports = {
  handleUsers: handleUsers,
};

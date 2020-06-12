const clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "8116aa3fd2ab4c8ab0f72679c10052c3",
});
const handleApiCall = () => (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("unable to get response"));
};
const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("enteries", 1)
    .returning("enteries")
    .then((enteries) => {
      res.json(enteries[0]);
    })
    .catch((err) => res.status(400).json("unable to get enteries"));
};

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall,
};

const express = require("express");
const Posts = require("../data/db");
const router = express.Router();

router.get("/", (req, res) => {
  Posts.find(req.query)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving posts" });
    });
});

module.exports = router;

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

router.post("/", (req, res) => {
  const { title, contents } = req.body;

  if (title && contents) {
    Posts.insert(req.body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: "Error adding the post" });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post"
    });
  }
});

router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const newComment = {
    text: text,
    post_id: id
  };

  Posts.findById(id)
    .then(post => {
      if (post.length > 0) {
        Posts.insertComment(newComment)
          .then(comment => {
            res.status(201).json(comment);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "Could not add comment" });
          });
      } else {
        res.status(404).json({ errorMessage: "Not found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error adding coment" });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length > 0) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ errorMessage: "Could not find post" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error retrieving post" });
    });
});

router.get("/:id/comments", (req, res) => {
  Posts.findById(req.params.id).then(item => {
    if (item.length > 0) {
      Posts.findPostComments(req.params.id)
        .then(post => {
          res.status(200).json(post);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ errorMessage: "Could not get comments" });
        });
    } else {
      res.status(500).json({ errorMessage: "Error retrieving comments" });
    }
  });
});

router.delete("/:id", (req, res) => {
  Posts.findById(req.params.id).then(item => {
    if (item.length > 0) {
      Posts.remove(req.params.id)
        .then(post => {
          res.status(200).json(post);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ errorMessage: "Error deleting post" });
        });
    } else {
      res.status(404).json({ errorMessage: "Post could not be found" });
    }
  });
});

router.put("/:id", (req, res) => {
  Posts.update(req.params.id, req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error editing post" });
    });
});

module.exports = router;

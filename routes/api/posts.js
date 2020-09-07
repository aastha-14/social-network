const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/Users");
const Posts = require("../../models/Posts");

// @route   POST api/posts
// @desc    Post route
// @access  Private

router.post(
  "/",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      const post = new Post(newPost);

      await post.save();
      res.json(post);
    } catch (e) {
      console.error(e.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/posts
// @desc    GET posts
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    if (!posts) res.status(404).json({ msg: "No posts found" });

    res.json(posts);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts/:post_id
// @desc    GET single post by id
// @access  Private
router.get("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) res.status(404).json({ msg: "No post found" });
    res.json(post);
  } catch (e) {
    console.error(e.message);
    if (e.kind === "ObjectId") res.status(404).json({ msg: "No post found" });
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/posts/:post_id
// @desc    Delete single post by id
// @access  Private
router.delete("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (post.user.toString() !== req.user.id) {
      res.status(401).json({ msg: "User not authorized!" });
    }

    if (!post) res.status(404).json({ msg: "No post found!" });

    await post.remove();
    res.json({ msg: "Post deleted!" });
  } catch (e) {
    console.error(e.message);
    if (e.kind === "ObjectId") res.status(404).json({ msg: "No post found!" });
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/posts/like/:post_id
// @desc    Like a post
// @access  Private
router.put("/like/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) res.status(404).json({ msg: "No post found!" });

    // check if the post has alredy been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (e) {
    console.error(e.message);
    if (e.kind === "ObjectId") res.status(404).json({ msg: "No post found!" });
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/posts/unlike/:post_id
// @desc    Unlike a post
// @access  Private
router.put("/unlike/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) res.status(404).json({ msg: "No post found!" });

    // check if the post has alredy been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length == 0
    ) {
      res.status(400).json({ msg: "Post has not been liked yet" });
    }

    // Get remove index

    const removeIndex = post.likes
      .map((item) => item.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (e) {
    console.error(e.message);
    if (e.kind === "ObjectId") res.status(404).json({ msg: "No post found!" });
    res.status(500).send("Server Error");
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private

router.post(
  "/comment/:id",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      if (!post) res.status(404).json({ msg: "No post found!" });

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (e) {
      console.error(e.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete Comment on a post
// @access  Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) res.status(404).json({ msg: "No post found!" });

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) res.status(404).json({ msg: "Comment does not exists" });

    // Check User
    if (comment.user.toString() != req.user.id)
      res.status(401).json({ msg: "User not authorized" });

    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

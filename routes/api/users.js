const express = require("express");
const gravatar = require("gravatar");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../../models/Users");

// @route   POST api/users
// @desc    Register user
// @access  Public

router.post(
  "/",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ error: [{ msg: "User already exists" }] });
      }
    } catch (e) {
      console.error(e.message);
      res.status(500).send("Server error");
    }
    const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

    user = new User({
      name,
      email,
      avatar,
      password,
    });

    // const salt = bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.send("User registered");
  }
);

module.exports = router;

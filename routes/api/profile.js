const express = require("express");
const router = express.Router();
const Profile = require("../../models/Profile");
const User = require("../../models/Users");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const config = require("config");
const request = require("request");
// @route   GET api/profile/myProfile
// @desc    Get current users profile
// @access  Private

router.get("/myPofile", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      twiter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    // Build profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Build social Object

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twiter) profileFields.social.twiter = twiter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Update
        const profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      // Create
      profile = new Profile(profileFields);

      await profile.save();
      return res.json(profile);
    } catch (e) {
      console.error(e.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/profile/user/:id
// @desc    Get profile by id
// @access  Public
router.get("/user/:id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.json(profile);
  } catch (e) {
    console.error(e.message);
    if (e.kind === "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/profile
// @desc    Delete profile user and posts
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({
      user: req.user.id,
    });

    await User.findOneAndRemove({
      _id: req.user.id,
    });

    res.json({ msg: "Deleted successfully" });
  } catch (e) {
    console.error(e.message);
    if (e.kind === "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   ADD api/profile/experience
// @desc    Add profile experience
// @access  Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      from,
      to,
      location,
      current,
      description,
    } = req.body;

    const newExp = { title, company, from, to, location, current, description };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        res.status(400).json({ msg: "profile not found" });
      }

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (e) {
      console.error(e.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete profile experience
// @access  Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      res.status(400).json({ msg: "profile not found" });
    }

    // Get index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server error");
  }
});

// @route   ADD api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "degree is required").not().isEmpty(),
      check("fieldOfStudy", "fieldOfStudy is required").not().isEmpty(),
      check("from", "from date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description,
    } = req.body;

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        res.status(400).json({ msg: "Profile not found" });
      }

      const newEducation = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description,
      };

      profile.education.unshift(newEducation);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.error(e.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete profile education
// @access  Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      res.status(400).json({ msg: "Profile not found" });
    }

    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/profile/github/username
// @desc    Get user repos from github
// @access  Public
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      url: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (error, respose, body) => {
      if (error) console.error(error);
      if (respose.statusCode !== 200) {
        res.status(404).json({ msg: "No github profile found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
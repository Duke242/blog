const express = require("express");
const { setup } = require('../models/mongoose')
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
require("dotenv").config();

// Make new user

router.post("/", async (req, res) => {
  setup(mongoose)
  const { username, password } = req.body;
  const User = mongoose.model('user')

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "Email is in use" }] });
    }

    user = new User({
      username,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

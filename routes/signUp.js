const express = require('express')
const flash = require('express-flash');
const mongoose = require('mongoose')
const router = express.Router()
const { setup } = require('../models/mongoose')
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');




router.get('/', (req, res) => {
  res.render('signUp')
})

router.post('/', [
  body("username", "Username must be at least 3 characters long.")
  .trim()
  .isLength({ min: 3 })
  .escape(),
body("password", "Password must be at least 3 characters long.")
  .trim()
  .isLength({ min: 6 })
  .escape(),
body("confirmPassword", "Password must be at least 3 characters long.")
  .trim()
  .isLength({ min: 6 })
  .escape()
  .custom(async (value, { req }) => {
    if (value !== req.body.password)
      throw new Error("Confirmed Password must be the same as password");
    return true;
  }),
],async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    req.flash('error', errorMessages);
    return res.redirect('/signUp');
  }
    setup(mongoose)
    const { username, password } = req.body
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10) 
      setup(mongoose);
      const User = mongoose.model("user");
      const newUser = new User({
        username,
        password: hashedPassword,
      });
      await newUser.save();
      res.redirect("/");
    
  } catch (err) {
    return next(err);
  }
  
})

module.exports = router 
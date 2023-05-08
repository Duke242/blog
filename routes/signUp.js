const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { setup } = require('../models/mongoose')

router.get('/', (req, res) => {
  res.render('signUp')
})

router.post('/', async (req, res) => {
  setup(mongoose)
  const { username, password } = req.body
  try {
    const User = mongoose.model('user')
    const newUser = new User({
      username,
      password
    })
  await newUser.save()
  res.redirect('/')
  } catch (err) {
    console.log(err)
  }
  
})

module.exports = router 
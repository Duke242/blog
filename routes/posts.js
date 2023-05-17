const express = require('express')
const { setup } = require('../models/mongoose')
const { default: mongoose, mongo } = require('mongoose')
const passport = require('passport')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('posts')
})

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req)
  const { title, text } = req.body
  setup(mongoose)
  try {
    const Post = mongoose.model('post')
    const newPost = new Post({
      title,
      text,
      author: req.user,
      timestamp: new Date(),
      likes: 0
    })
    newPost.save().then(() => {
      res.redirect('/')
    })
  } catch(err) {
    console.log(err)
  }
})

module.exports = router;

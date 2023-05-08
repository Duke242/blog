const express = require('express')
const { setup } = require('../models/mongoose')
const { default: mongoose, mongo } = require('mongoose')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('posts')
})

router.post('/', async (req, res) => {
  const { title, text, author } = req.body
  setup(mongoose)
  try{
    const Post = mongoose.model('post')
    const newPost = new Post({
      title,
      text,
      author,
      timeStamp: new Date(),
      likes: 0
    })
    await newPost.save()
    res.redirect('/')
  } catch {
    console.log(err)
  }
})

module.exports = router;

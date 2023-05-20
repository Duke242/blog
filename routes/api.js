const express = require('express')
const router = express.Router()
const { setup } = require('../models/mongoose')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')

router.get('/posts', auth, async(req, res) => {
  try {
    setup(mongoose)
    const Post = mongoose.model('post')
    const posts = await Post.find({}).populate({
      path: 'author',
      select: 'username'
    })
    res.json(posts)
  } catch(err) {
    console.log(err)
  }
})

router.get('/posts/comments', async (req, res) => {
  try{
    setup(mongoose)
    const Post = mongoose.model('post')
    const posts = await Post.find({}).populate({
      path: 'author',
      select: 'username'
    })
    const Comment = mongoose.model('comment')
    const comments = await Comment.find()
    res.json({posts, comments})
  } catch(err){
    console.log(err)
  }
})

router.post('/newPost', auth, async (req, res) => {
  console.log(req.user)
  const { title, text } = req.body
  setup(mongoose)
  const Post = mongoose.model('post')
  const newPost = new Post({
    title, 
    text,
    author: req.user.id,
    timestamp: new Date(),
    likes: 0,
  })
await newPost.save()
res.json(newPost)
})



module.exports = router 
var express = require('express');
const { setup } = require('../models/mongoose');
const { default: mongoose } = require('mongoose');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const { title, text, author } = req.body
  setup(mongoose)
  const Comment = mongoose.models('comment')
  const comments = Comment.find()
  const Post = mongoose.models('post')
  const posts = Post.find() 
  res.render('index',{ comments, posts });
});

module.exports = router;

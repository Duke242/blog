var express = require('express');
const { setup } = require('../models/mongoose');
const { default: mongoose } = require('mongoose');
var router = express.Router();
const passport = require('passport')

/* GET home page. */
router.get('/', passport.authenticate('jwt', { session: false }),
  async function(req, res) {
  console.log(req.user)
    
  setup(mongoose)
  const Comment = mongoose.model('comment')
  const comments = await Comment.find()
  const Post = mongoose.model('post')
  const posts = Post.find({}).populate({
    path: 'author',
    select: 'username'
  }).then((posts) => {
    // console.log(messages)
    res.render('index', { posts, comments });
  }).catch((err) => {
    handleError(err);
  });

})



module.exports = router;

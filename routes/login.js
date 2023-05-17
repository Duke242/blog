const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { setup } = require('../models/mongoose');
const jwt = require('jsonwebtoken');
const passport = require("passport");
const initialize = require("../validators/passportConfig.js");

initialize(passport)
setup(mongoose)
const User = mongoose.model('user')

router.get('/', (req, res) => {
  res.render('login')
})

router.post('/', async (req, res, next) => {
  try {
    passport.authenticate("local", { session: false }, (err, user) => {
      console.log('20', res.cookie)
      if (err){
        return res.status(500).send(err.message)
      }
      if (err || !user) {
        return res.status(401).json({
          message: "Incorrect Username or Password",
          user,
        });
      }
      const response = {
        username: user.username,
      }
      console.log(jwt.sign(response, process.env.SECRET))
      res.cookie('jwt', jwt.sign(response, process.env.SECRET), { maxAge: 900000, httpOnly: true });
      res.redirect('/')
    })(req, res, next);
  } catch(err) {
    res.status(500).send(`ERROR: ${err.message}`)
  }
});


// const initialize = async (username, password) => {
//   try {
//     // Find the user with the provided username
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(401).send({ message: "Invalid username or password" });
//     }

//     // Compare the provided password with the hashed password
//     const passwordIsValid = await bcrypt.compare(password, user.password);
//     if (!passwordIsValid) {
//       return res.status(401).send({ message: "Invalid username or password" });
//     }

//     // Create a JSON Web Token
//     const token = jwt.sign({ id: user.id }, config.secret, {
//       expiresIn: 86400 // 24 hours
//     });

//     // Return the token as a response
//     return res.status(200).send({ token });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ message: "An error occurred" });
//   }
// };

// From passport see passportConfig for local strategy. TODO add option for OAUth?/

module.exports = router;

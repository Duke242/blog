const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');
const { setup } = require('../models/mongoose')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const PassportJWT = require('passport-jwt')
dotenv.config()

setup(mongoose)
const User = mongoose.model('user')

// Define Passport strategy outside the route handler function
// passport.use(new LocalStrategy(async(username, password, done) => {
//   try {
//     const user = await User.findOne({ username });
//     console.log({user}) 
//     if (!user) {
//       return done(null, false, { message: "Incorrect username" });
//     };
//     const passwordsMatch = await bcrypt.compare(password, user.password)
//     console.log({passwordsMatch})
//     if (passwordsMatch) {
//       // passwords match! log user in
//       console.log('password match')
//       jwt.sign(
//         { _id: user._id, username: user.username },
//         process.env.SECRET,
//         { expiresIn: "10m" },
//         (err, token) => {
//           if (err) return res.status(400).json(err);
//           return res.json({
//             token: token,
//             user: { _id: user._id, username: user.username },
//           });
//         }
//       );
//       return done(null, user)
//     } 
//     // passwords do not match!
//     console.log('passwords do not match')
//     return done(null, false, { message: "Incorrect password" })
//   } catch(err) {
//     return done(err);
//   };
// }));

function initialize(passport) {
  console.log("In initialize.")
    passport.use('local',new LocalStrategy(async(username, password, done) => {
      console.log('Line 50 in newLocalStrat')
        try {
          const user = await User.findOne({ username });
          console.log({user}) 
          if (!user) {
            return done(null, false, { message: "Incorrect username" });
          };
          const match = await bcrypt.compare(password, user.password)
          console.log({match})
          if (match) {
            // passwords match! log user in
            console.log('password match')
            // jwt.sign(
            //   { _id: user._id, username: user.username },
            //   process.env.SECRET,
            //   { expiresIn: "10m" },
            //   (err, token) => {
            //     if (err) return res.status(400).json(err);
            //     res.json({
            //       token: token,
            //       user: { _id: user._id, username: user.username },
            //     });
            //   }
            // );
            return done(null, user)
          } 
          // passwords do not match!
          console.log('passwords do not match')
          return done(null, false, { message: "Incorrect password" })
        } catch(err) {
          return done(err);
        };
    }))

    const jwtOptions = {
      // Authorization: Bearer in request headers
      jwtFromRequest: (...args) => {
        // const token = PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
        var cookieExtractor = function(req) {
          var token = null;
          if (req && req.cookies) {
              token = req.cookies['jwt'];
          }
          return token;
      };
      const token = cookieExtractor(...args)
      // ...
        console.log('jwtFromRequest', token)
        return token
      },
      secretOrKey: process.env.SECRET,
      // Algorithms used to sign in
      // algorithms: ["HS256", "HS384"]
    }
    
    // Passport JWT Strategy triggered by validateJWTWithPassportJWT 
    // https://www.npmjs.com/package/passport-jwt
    passport.use('jwt', new PassportJWT.Strategy(jwtOptions, 
      // Post-Verified token - https://www.npmjs.com/package/passport-jwt
      (jwtPayload, done) => {
        console.log('PassportJwt Strategy being processed');
        console.log(jwtPayload)
        // Find user in MongoDB using the `id` in the JWT
        User.findById(jwtPayload.sub)
        const user = User.findOne({ username: jwtPayload.username })
        // User.findById(jwtPayload._doc._id)
          .then((user) => {
            if (user) { 
              done(null, user); 
            } else {
              done(null, false); 
            }
          })
          .catch((error) => {
            done(error, false);
          })
  }
    ))

}
  module.exports = initialize
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { secret } = require("./config/jwt");
const User = require("./models/user");

const cookieExtractor = function(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: secret
    },
    async (payload, done) => {
      try {
        //Find user specified in token
        const user = await User.findById(payload.userid);

        //if user doesn't exist, handle it
        if (!user) {
          return done(null, false);
        }

        //otherwise, return the user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

module.exports = { passport };

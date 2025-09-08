const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('./db/queries')
var GoogleStrategy = require('passport-google-oidc');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
    async function(req, username, password, callback) {
        let response;
        try {
            response = await db.login(username)
            const userRecord = response[0]
            if(!userRecord) {
                return callback(null, false, {message: 'No user by that email'})
            }
            if (!userRecord.pwd_hash) {
                // This case handles users who signed up with a social provider
                return callback(null, false, { message: 'Please sign in using the method you originally used.' });
            }
            const match = await bcrypt.compare(password, userRecord.pwd_hash);
            if (match) {
                const { pwd_hash, ...user } = userRecord;
                return callback(null, user);
            } else {
                return callback(null, false, { message: 'Incorrect password.' });
            }
        } catch (error) {
                return callback(error)
            }
    }
))


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: [ 'email', 'profile' ]
  },
  async function verify(issuer, profile, cb) {
    try {
      const user = await db.findOrCreateGoogleUser({
        profileId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        provider: issuer,
      });
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
))

passport.serializeUser((user, callback) => {
    // Store only the user's ID in the session.
    // This keeps the session data small and secure.
    return callback(null, user.id);
})

passport.deserializeUser(async (id, callback) => {
    // Use the ID stored in the session to fetch the user from the database.
    try {
        // Use the new internal function instead of the route handler
        const userArray = await db.getUserById(id);
        const user = userArray[0];
        if (!user) {
            return callback(null, false, { message: 'User not found.' });
        }
        return callback(null, user);
    } catch (error) {
        return callback(error);
    }
});

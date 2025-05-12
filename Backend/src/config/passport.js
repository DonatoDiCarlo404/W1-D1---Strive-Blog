const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Author = require('../models/AuthorSchema');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Author.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/callback",
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        let author = await Author.findOne({ 
            $or: [
                { email: profile.emails[0].value },
                { googleId: profile.id }
            ]
        });

        if (!author) {
            const randomPassword = require('crypto').randomBytes(32).toString('hex');

            author = new Author({
                nome: profile.name.givenName,
                cognome: profile.name.familyName,
                email: profile.emails[0].value,
                password: randomPassword,
                avatar: profile.photos[0].value,
                googleId: profile.id
            });
            await author.save();
        } else if (!author.googleId) {
            author.googleId = profile.id;
            await author.save();
        }

        return done(null, author);
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;
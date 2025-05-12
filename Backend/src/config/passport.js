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
    callbackURL: "https://strive-blog-2iak.onrender.com/auth/google/callback",
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
            author = new Author({
                nome: profile.name.givenName,
                cognome: profile.name.familyName,
                email: profile.emails[0].value,
                password: 'google-auth-' + Math.random().toString(36).slice(-8),
                avatar: profile.photos[0].value,
                googleId: profile.id,
                dataDiNascita: new Date().toISOString().split('T')[0] // Data di default
            });
            await author.save();
        }

        return done(null, author);
    } catch (error) {
        console.error('Google Strategy Error:', error);
        return done(error, null);
    }
}));

module.exports = passport;
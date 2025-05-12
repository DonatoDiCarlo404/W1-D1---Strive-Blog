const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Route per l'autenticazione Google
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback dopo l'autenticazione Google
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login', session: false }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
    }
);

module.exports = router;
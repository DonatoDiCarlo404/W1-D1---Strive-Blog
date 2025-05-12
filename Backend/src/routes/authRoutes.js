const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email']
    })
);

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: `${process.env.FRONTEND_URL}/login`,
        session: false 
    }),
    (req, res) => {
        try {
            const token = jwt.sign(
                { id: req.user._id, email: req.user.email },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );
            
            res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
        } catch (error) {
            console.error('Token generation error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }
    }
);

module.exports = router;
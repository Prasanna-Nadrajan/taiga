const express = require('express');
const router = express.Router();
const { register, login, getMe, googleCallback, toggleWishlist, getWishlist } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const passport = require('passport');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Wishlist routes
router.put('/wishlist/:productId', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // We arrive here if authentication is successful
    // We can redirect to the frontend with a token. Let's let a specialized controller handle it or just do it here.
    // For now we'll route to a controller method
    const { googleCallback } = require('../controllers/authController');
    googleCallback(req, res);
  }
);

module.exports = router;

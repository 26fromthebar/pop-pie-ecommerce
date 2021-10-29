const express = require('express');
const { authUser } = require('../middlewares/auth');

const router = new express.Router();

// Home page
router.get('/', authUser, (req, res) => {
  res.render('home', { user: req.user });
});

// About page
router.get('/about', authUser, (req, res) => {
  res.render('about', { user: req.user });
});

// Contact page
router.get('/contact', authUser, (req, res) => {
  res.render('contact', { user: req.user });
});

// Ingredients page
router.get('/ingredients', authUser, (req, res) => {
  res.render('ingredients', { user: req.user });
});

// Privacy and policy page
router.get('/privacy', authUser, (req, res) => {
  res.render('privacy', { user: req.user });
});

// Terms and conditions page
router.get('/terms', authUser, (req, res) => {
  res.render('terms', { user: req.user });
});

// Cart page
router.get('/cart', authUser, (req, res) => {
  res.render('cart', {
    cartArray: req.session.cartArray || [],
    user: req.user,
  });
});

module.exports = router;

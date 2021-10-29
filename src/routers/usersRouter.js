const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { redirectHome } = require('../middlewares/redirect');

const router = new express.Router();

//sign up form
router.get('/signup', redirectHome, (req, res) => {
  res.render('signup', { error: null, user: null });
});

//sign up
router.post('/signup', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    req.session.userId = user._id;
    res.status(201).redirect('/');
  } catch (e) {
    res.render('signup', { error: e, user: null });
  }
});

//sign in form
router.get('/signin', redirectHome, (req, res) => {
  res.render('signin', { error: null, user: null });
});

//sign in
router.post('/signin', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error('Please check your credentials');
    }
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      throw new Error('Please check your credentials');
    }

    req.session.userId = user._id;

    res.status(200).redirect('/');
  } catch (e) {
    res.render('signin', { error: e, user: null });
  }
});

//logout user
router.post('/logout', async (req, res) => {
  req.session.destroy((e) => {
    if (e) {
      return res.send('Something went wrong!');
    }
  });

  res.clearCookie(process.env.SESS_NAME);

  res.redirect('/');
});

// //get user's account
// router.get('/user/account', (req, res) => {
//   try {
//     res.status(200).send('Hello world');
//   } catch (e) {
//     res.status(404).send(e);
//   }
// });

// //delete user's account
// router.delete('/user/delete', (req, res) => {});

module.exports = router;

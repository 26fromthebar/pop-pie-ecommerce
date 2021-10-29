const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const Product = require('../models/product');
const { authAdmin } = require('../middlewares/auth');
const { findByIdAndUpdate } = require('../models/product');

const router = new express.Router();

const upload = multer({
  limits: {
    filiSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.endsWith('.jpg')) {
      return cb(new Error('File must be jpg.'));
    }
    cb(undefined, true);
  },
});

//Get admin panel page
router.get('/admin/dashboard', authAdmin, async (req, res) => {
  const emptySearchMessage = req.session.emptySearchMessage || null;
  const noResultsFoundMessage = req.session.noResultsFoundMessage || null;
  const createdMessage = req.session.createdMessage || null;
  const deletedMessage = req.session.deletedMessage || null;
  const productsIds = req.session.searchResults || [];

  const products = await Promise.all(
    productsIds.map(async (productId) => await Product.findById(productId))
  );

  delete req.session.searchResults;
  delete req.session.emptySearchMessage;
  delete req.session.noResultsFoundMessage;
  delete req.session.createdMessage;
  delete req.session.deletedMessage;

  res.render('adminDashboard', {
    user: req.user,
    products,
    emptySearchMessage,
    noResultsFoundMessage,
    createdMessage,
    deletedMessage,
  });
});

// Create new product in admin panel
router.post(
  '/admin/create-product',
  authAdmin,
  upload.single('image'),
  async (req, res) => {
    const product = new Product(req.body);

    try {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 400, height: 400 })
        .jpeg()
        .toBuffer();
      product.image = buffer;
      await product.save();
      req.session.createdMessage = 'Product successfully added to database.';
      res.redirect('/admin/dashboard');
    } catch (e) {
      res.status(404).send(e);
    }
  }
);

// Search product in admin panel
router.post('/admin/search-product', authAdmin, async (req, res) => {
  // My code to get the search results
  // try {
  //   const term = req.body.search.toLowerCase();
  //   const products = await Product.find();

  //   const titles = products.map((product) => product.title.toLowerCase());

  //   const results = titles.filter((title) => title.includes(term));

  //   req.session.searchResults = results;
  //   res.redirect('/admin/dashboard');
  // } catch (e) {
  //   res.status(404).send(e.message);
  // }

  // A more efficient way to get the same results as above
  try {
    if (req.body.search.trim() === '' || !req.body.search) {
      req.session.emptySearchMessage =
        'Please type something in the search bar.';
      return res.redirect('/admin/dashboard');
    } else {
      const regex = new RegExp(req.body.search.trim(), 'i');

      const products = await Product.find({ title: { $regex: regex } });
      if (products.length > 0) {
        const productsIds = products.map((product) => product._id);
        req.session.searchResults = productsIds;

        return res.redirect('/admin/dashboard');
      } else {
        req.session.noResultsFoundMessage =
          'No results found, try another search.';
        res.redirect('/admin/dashboard');
      }
    }
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// Get edit-product page
router.get('/admin/edit-product/:id', authAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    res.render('edit', { user: req.user, product });
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// Edit product through admin panel
router.patch('/admin/edit-product/:id', authAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    await Product.findByIdAndUpdate(id, updates);
    res.redirect('/admin/dashboard');
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// Delete product from database, through admin panel
router.delete('/admin/delete-product', authAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.body.id);
    if (product) {
      req.session.deletedMessage = `${product.title} successfully removed from database.`;
    }
    res.status(200).send('Product deleted successfully!');
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;

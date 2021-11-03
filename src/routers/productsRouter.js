const express = require('express');

const Product = require('../models/product');
const { authUser } = require('../middlewares/auth');

const router = new express.Router();

// Get products (paginated results)
router.get('/products', authUser, async (req, res) => {
  try {
    const products = [];
    let category = req.query.category;

    if (req.query.category) {
      const categorizedProducts = await Product.find({
        category,
      });

      products.push(...categorizedProducts);
    }

    if (!req.query.category) {
      const uncategorizedProducts = await Product.find({});
      products.push(...uncategorizedProducts);
    }

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    results = products.slice(startIndex, endIndex);

    res.status(200).render('products', {
      category,
      limit,
      page,
      products,
      results,
      user: req.user,
    });
  } catch (err) {
    res.status(404).send(err);
  }
});

// Add products to cart
router.post('/products/cart', authUser, async (req, res) => {
  try {
    const product = await Product.findById(req.body.id);
    const cartProduct = product.toObject();

    cartProduct.price = req.body.price || product.priceS;
    cartProduct.quantity = req.body.quantity || 1;

    if (!req.session.cartArray) {
      req.session.cartArray = [];
    }

    req.session.cartArray.push(cartProduct);
    res.status(200).send('Added!');
  } catch (e) {
    res.status(404).send(e);
  }
});

// Delete product from cart
router.delete('/products/cart/delete-item', authUser, (req, res) => {
  req.session.cartArray.splice(req.body.idx, 1);
  res.status(200).send('Deleted');
});

// Delete all items from cart
router.delete('/products/cart/delete-all', authUser, (req, res) => {
  req.session.cartArray.length = 0;
  res.status(200).send('Deleted');
});

// Get product by id
router.get('/products/:id', authUser, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('card', { product, user: req.user });
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;

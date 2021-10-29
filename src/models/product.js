const mongoose = require('mongoose');
const validator = require('validator');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length < 1 || value.length > 40) {
        throw new Error('Name must have up to 40 characters');
      }
    },
  },
  description: {
    type: String,
    trim: true,
    validate(value) {
      if (value.length < 1 || value.length > 150) {
        throw new Error('Description must have up to 250 characters');
      }
    },
  },
  image: {
    type: Buffer,
    required: true,
  },
  priceS: {
    type: String,
    validate(value) {
      if (
        !validator.isCurrency(value, {
          allow_negatives: false,
          digits_after_decimal: [1, 2],
        })
      ) {
        throw new Error('Price cannot have more than two decimals');
      }
    },
  },
  priceL: {
    type: String,
    validate(value) {
      if (
        !validator.isCurrency(value, {
          allow_negatives: false,
          digits_after_decimal: [1, 2],
        })
      ) {
        throw new Error('Price cannot have more than two decimals');
      }
    },
  },
  category: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

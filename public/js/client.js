// Navbar signin btn
const signinBtn = document.querySelector('[data-signin-btn]');
// Navbar signup btn
const signupBtn = document.querySelector('[data-signup-btn]');
// Navigation admin button
const adminBtn = document.querySelector('[data-admin-btn]');
// Hero-section btn
const heroBtn = document.querySelector('.hero__btn');
// Logout btn
const logoutBtn = document.querySelector('[data-user-logout]');
// Slideshow home page
const slideboxes = document.querySelectorAll('[data-favorites-slidebox]');
const nextImg = document.querySelector('[data-favorites-next]');
const previousImg = document.querySelector('[data-favorites-previous]');
const dots = document.querySelectorAll('[data-favorites-dot]');
// Product card page
const productImages = document.querySelectorAll('[data-img-product-id]');
const cardQuantity = document.querySelector('[name="card-quantity"]');
const cardPrices = document.querySelectorAll('[name="card-price"]');
// Add to cart btns
const addToCartButtons = document.querySelectorAll('[data-btn-product-id]');
// Products page sidebar nav
const navLinks = document.querySelectorAll('.navbar ul a');
const categoryLinks = document.querySelectorAll('.products__nav-link');
// Products page pagination
const previousBtn = document.querySelector('[data-pagination-btn-previous]');
const nextBtn = document.querySelector('[data-pagination-btn-next]');
// Cart page delete btns
const deleteFromCartBtns = document.querySelectorAll('[data-remove-from-cart]');
const clearCartBtn = document.querySelector('[data-clear-cart]');
// Cart page calculate and display prices
const cartProductSumArr = document.querySelectorAll('[data-cart-product-sum]');
const cartItemPriceArr = document.querySelectorAll('[data-cart-product-price');
const cartQuantityArr = document.querySelectorAll('[name="cart-quantity"]');
const cartSubtotal = document.querySelector('[data-cart-checkout-subtotal]');
const cartTaxes = document.querySelector('[data-cart-checkout-taxes]');
const cartTotal = document.querySelector('[data-cart-checkout-total]');
const checkoutBtn = document.querySelector('[data-cart-checkout-btn]');
// Admin panel delete product btn
const deleteProductBtnArr = document.querySelectorAll(
  '[data-delete-product-id]'
);
// Admin panel edit product btn
const editProductBtnArr = document.querySelectorAll('[data-edit-product-id]');

//////////////////////////////////////////////
//////////////////////////////////////////////

// Navbar signin btn
if (signinBtn) {
  signinBtn.addEventListener('click', () => {
    window.location.href = '/signin';
  });
}

// Navbar signup btn
if (signupBtn) {
  signupBtn.addEventListener('click', () => {
    window.location.href = '/signup';
  });
}

// Navigation admin button
if (adminBtn) {
  adminBtn.addEventListener('click', () => {
    window.location.href = '/admin/dashboard';
  });
}

// Hero-section btn
if (heroBtn) {
  heroBtn.addEventListener('click', (e) => {
    window.location.href = '/products?page=1&limit=12';
  });
}

// User logout button
if (logoutBtn) {
  logoutBtn.addEventListener('click', async (e) => {
    await axios.post('/logout');
    window.location.href = '/';
  });
}

// Favorites section slideshow
let count = 1;

const showNextImg = () => {
  if (count > slideboxes.length - 1) {
    count = 0;
  }

  for (i = 0; i < slideboxes.length; i++) {
    if (i !== count) {
      slideboxes[i].style.opacity = 0;
      dots[i].style.backgroundColor = '#8b6f25';
    } else {
      slideboxes[i].style.opacity = 1;
      dots[i].style.backgroundColor = '#161b26';
    }
  }

  count++;
  console.log(count);
};

// const showPreviousImg = () => {
//   if (count < slideboxes.length - 1) {
//     count = 4;
//   }

//   for (i = 0; i < slideboxes.length; i++) {
//     if (i !== count - 2) {
//       slideboxes[i].style.opacity = 0;
//       dots[i].style.backgroundColor = '#8b6f25';
//     } else {
//       slideboxes[i].style.opacity = 1;
//       dots[i].style.backgroundColor = '#161b26';
//     }
//   }

//   count--;
//   console.log(count);
// };

const showPreviousImg = () => {
  if (count > slideboxes.length + 1 || count < 2) {
    count = 5;
  }

  for (i = 0; i < slideboxes.length; i++) {
    if (i !== count - 2) {
      slideboxes[i].style.opacity = 0;
      dots[i].style.backgroundColor = '#8b6f25';
    } else {
      slideboxes[i].style.opacity = 1;
      dots[i].style.backgroundColor = '#161b26';
    }
  }

  count--;
  console.log(count);
};

const showImg = (e) => {
  for (i = 0; i < dots.length; i++) {
    if (i !== parseInt(e.target.dataset.favoritesDot) - 1) {
      slideboxes[i].style.opacity = 0;
      dots[i].style.backgroundColor = '#8b6f25';
    } else {
      slideboxes[i].style.opacity = 1;
      dots[i].style.backgroundColor = '#161b26';
    }
  }

  count = parseInt(e.target.dataset.favoritesDot);
};

if (nextImg && previousImg) {
  nextImg.addEventListener('click', showNextImg);
  previousImg.addEventListener('click', showPreviousImg);
}

if (dots) {
  dots.forEach((dot) => {
    dot.addEventListener('click', showImg);
  });
}

// Click image to see product card
if (productImages.length > 0) {
  productImages.forEach((productImage) => {
    productImage.addEventListener('click', async () => {
      const id = productImage.dataset.imgProductId;
      await axios.get(`/products/${id}`);
      window.location.href = `/products/${id}`;
    });
  });
}

// Add product to cart
if (addToCartButtons.length > 0) {
  addToCartButtons.forEach((addToCartButton, index) => {
    addToCartButton.addEventListener('click', async (e) => {
      e.preventDefault();

      let id = addToCartButton.dataset.btnProductId;

      if (!cardPrices || !cardQuantity) {
        await axios.post('/products/cart', { id });
      } else {
        const productPrice = [];
        cardPrices.forEach((cardPrice) => {
          if (cardPrice.checked) {
            productPrice.push(cardPrice);
          }
        });

        let price = productPrice[0].value;
        let quantity = cardQuantity.value;

        console.log({ id, price, quantity });

        await axios.post('/products/cart', { id, price, quantity });
      }

      window.location.href = '/cart';
    });
  });
}

// Display each item's subtotal price in cart
if (
  cartProductSumArr.length > 0 &&
  cartItemPriceArr.length > 0 &&
  cartQuantityArr.length > 0
) {
  calculateProductSum();

  cartQuantityArr.forEach((quantity) => {
    quantity.addEventListener('change', calculateProductSum);
  });
}

function calculateProductSum() {
  cartItemPriceArr.forEach((itemPrice, i) => {
    cartProductSumArr[i].innerText = `$${parseFloat(
      itemPrice.dataset.cartProductPrice * cartQuantityArr[i].value
    ).toFixed(2)}`;
    cartProductSumArr[i].dataset.cartProductSum = parseFloat(
      itemPrice.dataset.cartProductPrice * cartQuantityArr[i].value
    ).toFixed(2);
  });
  showTotal();
}

function showTotal() {
  let total = 0;
  cartProductSumArr.forEach((productSum) => {
    total = total + Number(productSum.dataset.cartProductSum);
  });

  let subtotal = parseFloat(total / 1.24).toFixed(2);
  let taxes = parseFloat(total - subtotal).toFixed(2);

  cartTotal.innerText = `Total: $${parseFloat(total).toFixed(2)}`;
  cartSubtotal.innerText = `Subtotal: $${subtotal}`;
  cartTaxes.innerText = `Taxes: $${taxes}`;
}

// Delete item from cart
if (deleteFromCartBtns.length > 0) {
  deleteFromCartBtns.forEach((deleteFromCartBtn, index) => {
    let idx = index;
    deleteFromCartBtn.addEventListener('click', async (e) => {
      await axios.delete(`/products/cart/delete-item`, { data: { idx } });
      window.location.href = '/cart';
    });
  });
}

// Delete all items from cart
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', async (e) => {
    await axios.delete('/products/cart/delete-all');
    window.location.href = '/cart';
  });
}

// // Pagination previous and next buttons
// function getUrl(num) {
//   const currentUrl = window.location.href;

//   const getQuery = currentUrl.split('&')[1];

//   let currentSkipVal = parseInt(getQuery.split('=')[1]);

//   if (currentSkipVal + num < 0 || currentSkipVal + num > 30) {
//     return currentUrl;
//   }

//   return `/products?limit=12&skip=${currentSkipVal + num}`;
// }

// if (previousBtn) {
//   previousBtn.addEventListener('click', (e) => {
//     const url = getUrl(-12);

//     window.location.href = url;
//   });
// }

// if (nextBtn) {
//   nextBtn.addEventListener('click', (e) => {
//     const url = getUrl(12);

//     window.location.href = url;
//   });
// }

//Focus on the navbar according to the page we are currently viewing
const activePage = window.location.pathname;

navLinks.forEach((link) => {
  if (link.href.includes(`${activePage}`) && activePage === '/') {
    navLinks[0].classList.add('active');
  } else if (link.href.includes(`${activePage}`)) {
    link.classList.add('active');
  }
});

const activeCategory = window.location.search.split('&')[0].split('=')[1];
categoryLinks.forEach((link, idx) => {
  switch (activeCategory) {
    case 'fruit':
      categoryLinks[1].classList.add('active');
      break;
    case 'sweet':
      categoryLinks[2].classList.add('active');
      break;
    case 'savory':
      categoryLinks[3].classList.add('active');
      break;
    case 'vegan':
      categoryLinks[4].classList.add('active');
      break;
    default:
      categoryLinks[0].classList.add('active');
  }
});

// Admin panel delete product
if (deleteProductBtnArr.length > 0) {
  deleteProductBtnArr.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const id = btn.dataset.deleteProductId;
      console.log(id);
      await axios.delete('/admin/delete-product', { data: { id } });
      window.location.href = '/admin/dashboard';
    });
  });
}

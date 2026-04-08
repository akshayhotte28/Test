const productData = {
  1: { name: 'Minimalist Tee', price: 34 },
  2: { name: 'Urban Track Jacket', price: 78 },
  3: { name: 'Everyday Knit Hoodie', price: 64 },
  4: { name: 'Signature Cargo Pant', price: 88 },
  5: { name: 'Layered Knit Cardigan', price: 72 },
  6: { name: 'Core Essentials Short', price: 38 },
};

const cartKey = 'urban-aura-cart';

function getCart() {
  const stored = localStorage.getItem(cartKey);
  return stored ? JSON.parse(stored) : {};
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = count;
  }
}

function addToCart(productId) {
  const cart = getCart();
  if (!cart[productId]) {
    cart[productId] = { ...productData[productId], quantity: 0 };
  }
  cart[productId].quantity += 1;
  saveCart(cart);
  updateCartCount();
  alert(`${productData[productId].name} added to cart.`);
}

function removeFromCart(productId) {
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
  renderCart();
  updateCartCount();
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const summaryCount = document.getElementById('summary-count');
  const summaryTotal = document.getElementById('summary-total');
  const checkoutButton = document.getElementById('checkout-button');

  if (!cartItems || !summaryCount || !summaryTotal || !checkoutButton) {
    return;
  }

  const cart = getCart();
  const items = Object.entries(cart);

  if (items.length === 0) {
    cartItems.innerHTML = '<p>Your cart is currently empty.</p>';
    summaryCount.textContent = '0';
    summaryTotal.textContent = '$0';
    checkoutButton.classList.add('disabled');
    checkoutButton.disabled = true;
    return;
  }

  cartItems.innerHTML = items
    .map(([id, item]) => {
      const itemTotal = item.quantity * item.price;
      return `
        <div class="cart-product">
          <div class="product-swatch swatch-${id}"></div>
          <div class="cart-product-info">
            <h3>${item.name}</h3>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${item.price}</p>
          </div>
          <div>
            <p class="product-price">$${itemTotal}</p>
            <button onclick="removeFromCart('${id}')">Remove</button>
          </div>
        </div>
      `;
    })
    .join('');

  const totalItems = items.reduce((sum, [, item]) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, [, item]) => sum + item.quantity * item.price, 0);

  summaryCount.textContent = totalItems;
  summaryTotal.textContent = `$${totalPrice}`;
  checkoutButton.classList.remove('disabled');
  checkoutButton.disabled = false;
}

function attachCartButtons() {
  const buttons = document.querySelectorAll('.add-cart');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      if (productId) {
        addToCart(productId);
      }
    });
  });
}

function toggleNavMenu() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

window.addEventListener('DOMContentLoaded', () => {
  attachCartButtons();
  toggleNavMenu();
  updateCartCount();
  renderCart();
});

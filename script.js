// ----------------- CATEGORY FILTERING -----------------
function filterProducts(category, btn) {
  const buttons = document.querySelectorAll('.category-btn');
  buttons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const products = document.querySelectorAll('.product');
  products.forEach(product => {
    if (category === 'all' || product.dataset.category === category) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

// ----------------- SWATCHES & VARIANTS -----------------
const productVariants = {
  "silk-hijab": [
    {color:"Red", image:"assets/products/hijab1.jpeg"},
    {color:"Blue", image:"assets/products/hijab1-blue.jpeg"},
    {color:"Beige", image:"assets/products/hijab1-beige.jpeg"}
  ],
  "chiffon-hijab": [
    {color:"Pink", image:"assets/products/hijab2.jpeg"},
    {color:"Black", image:"assets/products/hijab2-black.jpeg"}
  ],
  "cotton-hijab": [
    {color:"White", image:"assets/products/hijab3.jpeg"},
    {color:"Grey", image:"assets/products/hijab3-grey.jpeg"}
  ],
  "jorget-hijab": [
    {color:"Navy", image:"assets/products/hijab4.jpeg"},
    {color:"Brown", image:"assets/products/hijab4-brown.jpeg"}
  ]
};

// Render swatches for each product
document.querySelectorAll('.product').forEach(product => {
  const pid = product.dataset.productId;
  const swatchesContainer = product.querySelector('.swatches');
  if (productVariants[pid]) {
    productVariants[pid].forEach((variant, idx) => {
      const swatch = document.createElement('button');
      swatch.classList.add('swatch-btn');
      swatch.style.backgroundColor = variant.color.toLowerCase();
      swatch.title = variant.color;
      swatch.addEventListener('click', () => {
        // Update main image
        product.querySelector('.product-main-image').src = variant.image;
        // Update data-variant for buttons
        product.querySelectorAll('.quick-btn, .add-btn').forEach(btn => {
          btn.dataset.variant = idx;
        });
      });
      swatchesContainer.appendChild(swatch);
    });
  }
});

// ----------------- CART & QUICK VIEW -----------------
let cart = [];

function addToCartFromBtn(btn) {
  const productId = btn.dataset.product;
  const variantIndex = parseInt(btn.dataset.variant || 0);
  const variant = productVariants[productId][variantIndex];

  cart.push({ productId, variantIndex, name: `${productId} (${variant.color})`, price: parseFloat(document.querySelector(`[data-product-id="${productId}"] p`).textContent.replace('$','')) });
  updateCartCount();
  renderCartItems();
}

function quickViewFromBtn(btn) {
  const productId = btn.dataset.product;
  const variantIndex = parseInt(btn.dataset.variant || 0);
  const variant = productVariants[productId][variantIndex];

  document.getElementById('product-title').textContent = `${productId} (${variant.color})`;
  document.getElementById('product-image').src = variant.image;
  document.getElementById('quickview').style.display = 'block';
}

function closeQuickView() {
  document.getElementById('quickview').style.display = 'none';
}

// ----------------- CART PANEL -----------------
function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.length;
}

function renderCartItems() {
  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  cart.forEach((item, idx) => {
    const div = document.createElement('div');
    div.textContent = `${item.name} - $${item.price}`;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => {
      cart.splice(idx, 1);
      updateCartCount();
      renderCartItems();
    };
    div.appendChild(removeBtn);
    container.appendChild(div);
  });
}

// ----------------- SCROLL TO SHOP -----------------
function scrollShop() {
  document.getElementById('shop').scrollIntoView({behavior:'smooth'});
}

// ----------------- QR / PAYMENT MODALS -----------------
function closeQRCode() {
  document.getElementById('qr-modal').style.display = 'none';
}

function checkoutWhatsApp() {
  let msg = 'Hello! I want to order:\n';
  cart.forEach(item => {
    msg += `- ${item.name} ($${item.price})\n`;
  });
  const url = `https://wa.me/923096502422?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function openPaymentOptions() {
  document.getElementById('payment-modal').style.display = 'block';
}

function closePaymentOptions() {
  document.getElementById('payment-modal').style.display = 'none';
}

function selectPayment(method) {
  alert(`Selected payment method: ${method}`);
  closePaymentOptions();
}

// ----------------- IMAGE ZOOM -----------------
function toggleZoom() {
  const img = document.getElementById('product-image');
  if (img.style.transform === 'scale(2)') {
    img.style.transform = 'scale(1)';
    img.style.cursor = 'zoom-in';
  } else {
    img.style.transform = 'scale(2)';
    img.style.cursor = 'zoom-out';
  }
}

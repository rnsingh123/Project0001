// Product Data
const products = [
  { id: 1, name: "Wireless Headphones", price: 59.99, category: "electronics", image: "https://placehold.co/300x200?text=Headphones", rating: 4.5 },
  { id: 2, name: "Smart Watch", price: 129.99, category: "electronics", image: "https://placehold.co/300x200?text=Smart+Watch", rating: 4.7 },
  { id: 3, name: "Running Shoes", price: 89.99, category: "fashion", image: "https://placehold.co/300x200?text=Running+Shoes", rating: 4.3 },
  { id: 4, name: "Leather Wallet", price: 34.99, category: "fashion", image: "https://placehold.co/300x200?text=Leather+Wallet", rating: 4.1 },
  { id: 5, name: "Coffee Maker", price: 49.99, category: "home", image: "https://placehold.co/300x200?text=Coffee+Maker", rating: 4.6 },
  { id: 6, name: "Desk Lamp", price: 24.99, category: "home", image: "https://placehold.co/300x200?text=Desk+Lamp", rating: 4.2 },
  { id: 7, name: "Yoga Mat", price: 29.99, category: "sports", image: "https://placehold.co/300x200?text=Yoga+Mat", rating: 4.4 },
  { id: 8, name: "Dumbbell Set", price: 74.99, category: "sports", image: "https://placehold.co/300x200?text=Dumbbell+Set", rating: 4.8 },
  { id: 9, name: "Bluetooth Speaker", price: 44.99, category: "electronics", image: "https://placehold.co/300x200?text=BT+Speaker", rating: 4.3 },
  { id: 10, name: "Sunglasses", price: 19.99, category: "fashion", image: "https://placehold.co/300x200?text=Sunglasses", rating: 3.9 },
  { id: 11, name: "Air Fryer", price: 99.99, category: "home", image: "https://placehold.co/300x200?text=Air+Fryer", rating: 4.7 },
  { id: 12, name: "Water Bottle", price: 14.99, category: "sports", image: "https://placehold.co/300x200?text=Water+Bottle", rating: 4.5 },
];

// Cart Utilities
function getCart() {
  return JSON.parse(localStorage.getItem("vs_cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("vs_cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId) {
  const cart = getCart();
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showToast(`"${product.name}" added to cart`);
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll(".cart-badge").forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? "inline-block" : "none";
  });
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast align-items-center text-bg-success border-0 show";
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Star Rating HTML
function starsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = "";
  for (let i = 0; i < full; i++) html += '<i class="bi bi-star-fill text-warning"></i>';
  if (half) html += '<i class="bi bi-star-half text-warning"></i>';
  return html;
}

// Product Card HTML
function productCardHTML(product) {
  return `
    <div class="col" data-category="${product.category}">
      <div class="card product-card h-100 shadow-sm">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body d-flex flex-column">
          <span class="badge bg-secondary mb-1 text-capitalize">${product.category}</span>
          <h6 class="card-title">${product.name}</h6>
          <div class="mb-1">${starsHTML(product.rating)} <small class="text-muted">(${product.rating})</small></div>
          <p class="card-text fw-bold text-danger fs-5 mt-auto">$${product.price.toFixed(2)}</p>
          <button class="btn btn-warning btn-sm mt-2 add-to-cart-btn" onclick="addToCart(${product.id})">
            <i class="bi bi-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>`;
}

// ── Homepage ──────────────────────────────────────────────
function initHomepage() {
  const grid = document.getElementById("featured-products");
  if (!grid) return;
  const featured = products.slice(0, 8);
  grid.innerHTML = featured.map(productCardHTML).join("");
}

// ── Products Page ─────────────────────────────────────────
let currentCategory = "all";
let currentSort = "default";
let searchQuery = "";

function renderProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;
  let filtered = products.filter(p => {
    const matchCat = currentCategory === "all" || p.category === currentCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });
  if (currentSort === "low") filtered.sort((a, b) => a.price - b.price);
  if (currentSort === "high") filtered.sort((a, b) => b.price - a.price);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center py-5"><i class="bi bi-search fs-1 text-muted"></i><p class="mt-2 text-muted">No products found.</p></div>`;
  } else {
    grid.innerHTML = filtered.map(productCardHTML).join("");
  }
  document.getElementById("product-count").textContent = `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`;
}

function initProductsPage() {
  if (!document.getElementById("products-grid")) return;
  renderProducts();

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      renderProducts();
    });
  });

  document.getElementById("sort-select").addEventListener("change", e => {
    currentSort = e.target.value;
    renderProducts();
  });

  const pageSearch = document.getElementById("page-search");
  if (pageSearch) {
    pageSearch.addEventListener("input", e => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }
}

// ── Cart Page ─────────────────────────────────────────────
function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-cart-x fs-1 text-muted"></i>
        <h5 class="mt-3 text-muted">Your cart is empty</h5>
        <a href="products.html" class="btn btn-warning mt-3">Start Shopping</a>
      </div>`;
    document.getElementById("cart-summary").style.display = "none";
    return;
  }

  document.getElementById("cart-summary").style.display = "block";
  container.innerHTML = cart.map(item => `
    <div class="cart-item card mb-3 shadow-sm">
      <div class="card-body d-flex align-items-center gap-3 flex-wrap">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img rounded">
        <div class="flex-grow-1">
          <h6 class="mb-0">${item.name}</h6>
          <small class="text-muted text-capitalize">${item.category}</small>
          <p class="text-danger fw-bold mb-0">$${item.price.toFixed(2)}</p>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-outline-secondary btn-sm" onclick="changeQty(${item.id}, -1)"><i class="bi bi-dash"></i></button>
          <span class="fw-bold px-2">${item.qty}</span>
          <button class="btn btn-outline-secondary btn-sm" onclick="changeQty(${item.id}, 1)"><i class="bi bi-plus"></i></button>
        </div>
        <div class="fw-bold text-dark">$${(item.price * item.qty).toFixed(2)}</div>
        <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${item.id})"><i class="bi bi-trash"></i></button>
      </div>
    </div>`).join("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? (subtotal >= 50 ? 0 : 5.99) : 0;
  const total = subtotal + shipping;

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("shipping").textContent = shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;
  document.getElementById("item-count").textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    const idx = cart.indexOf(item);
    cart.splice(idx, 1);
  }
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

// ── Navbar Search ─────────────────────────────────────────
function initNavbarSearch() {
  const form = document.getElementById("navbar-search-form");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const q = document.getElementById("navbar-search-input").value.trim();
    if (q) window.location.href = `products.html?q=${encodeURIComponent(q)}`;
  });
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initNavbarSearch();
  initHomepage();
  initProductsPage();
  renderCart();

  // Pre-fill search from URL param on products page
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q) {
    searchQuery = q;
    const pageSearch = document.getElementById("page-search");
    if (pageSearch) pageSearch.value = q;
    renderProducts();
  }
});

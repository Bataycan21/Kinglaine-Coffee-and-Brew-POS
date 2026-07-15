/* =============================================
   KINGLAINE COFFEE & BREW — script.js (refactored)
   Same pages, cart, and UI behavior as before.
   The only real change: products/sizes/options/add-ons
   now load live from Supabase instead of a hardcoded list.
   ============================================= */

/* ===== SUPABASE CLIENT ===== */
const SUPABASE_URL = 'https://vgprkfxmeioxevtocenp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncHJrZnhtZWlveGV2dG9jZW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNzM3NjMsImV4cCI6MjA4NzY0OTc2M30.KoPJ4JXgPtZ13OHAwYVukfyWQykWJ2Gzr3CAWIBuSkA';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ===== CATEGORY METADATA (display copy only — not product data) ===== */
const CATEGORY_META = {
  coffee: { title: 'Signature Coffee', desc: 'Ethically sourced, small-batch roasted beans curated for the ultimate sensory experience.' },
  tea:    { title: 'Artisan Teas',     desc: 'Carefully sourced whole-leaf teas and seasonal blends, steeped to perfection.' },
  bakery: { title: 'The Bakery',       desc: 'Hand-crafted pastries baked fresh each morning from stone-milled flour.' },
  frappe: { title: 'Frappes',          desc: 'Blended, chilled, and finished with all the toppings.' }
};

/* ===== LIVE DATA CACHES (populated by loadCatalog()) ===== */
let PRODUCTS = {};          // id -> product row
let SIZES_BY_PRODUCT = {};  // product_id -> [{id, label, price}]
let OPTION_GROUPS_BY_PRODUCT = {}; // product_id -> [{id, name, values:[{id,label,price_delta}]}]
let ADDONS = [];            // [{id, label, price}]
let catalogLoaded = false;

/* ===== CART STATE ===== */
let cart              = [];
let currentPage       = 'home';
let currentProduct    = null;
let currentProductQty = 1;
let selectedSizeId    = null;
let selectedOptionValues = {}; // group_id -> value_id

/* =============================================
   CATALOG LOADING — replaces the old hardcoded PRODUCTS object
   ============================================= */
async function loadCatalog() {
  const [{ data: products, error: pErr }, { data: sizes }, { data: groups }, { data: addons }] = await Promise.all([
    sb.from('products').select('*').eq('is_active', true).order('category').order('name'),
    sb.from('product_sizes').select('product_id, size_id, price, sizes(id, label, sort_order)').order('sizes(sort_order)'),
    sb.from('option_groups').select('*, option_values(*)').order('sort_order'),
    sb.from('addons').select('*').eq('is_active', true).order('label')
  ]);

  if (pErr) { console.error(pErr); showToast('Could not load the menu. Please refresh.', 'error'); return; }

  PRODUCTS = {};
  (products || []).forEach(p => { PRODUCTS[p.id] = p; });

  SIZES_BY_PRODUCT = {};
  (sizes || []).forEach(row => {
    (SIZES_BY_PRODUCT[row.product_id] ||= []).push({
      id: row.size_id, label: row.sizes?.label || row.size_id, price: Number(row.price)
    });
  });

  OPTION_GROUPS_BY_PRODUCT = {};
  (groups || []).forEach(g => {
    if (!g.product_id) return;
    const values = (g.option_values || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(v => ({ id: v.id, label: v.label, price_delta: Number(v.price_delta) || 0 }));
    (OPTION_GROUPS_BY_PRODUCT[g.product_id] ||= []).push({ id: g.id, name: g.name, values });
  });

  ADDONS = (addons || []).map(a => ({ id: a.id, label: a.label, price: Number(a.price) }));

  catalogLoaded = true;
}

function productsByCategory(cat) {
  return Object.values(PRODUCTS).filter(p => p.category === cat);
}

/* =============================================
   NAVIGATION
   ============================================= */
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');
  currentPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'menu')    renderMenu('coffee');
  if (page === 'cart')    renderCartPage();
  if (page === 'rewards') renderRewards();
}

/* =============================================
   CART DRAWER
   ============================================= */
function openCart() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCartDrawer();
}

function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* =============================================
   MOBILE MENU
   ============================================= */
function toggleMobileMenu() { document.getElementById('mobile-menu').classList.toggle('open'); }
function closeMobileMenu()  { document.getElementById('mobile-menu').classList.remove('open'); }

/* =============================================
   TOAST NOTIFICATIONS
   ============================================= */
let toastTimer;
function showToast(msg, icon = 'check') {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent  = msg;
  document.getElementById('toast-icon').textContent = icon;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* =============================================
   CART LOGIC
   ============================================= */
function getCartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function getCartCount() { return cart.reduce((s, i) => s + i.qty, 0); }

function updateCartBadge() {
  const n     = getCartCount();
  const badge = document.getElementById('cart-badge');
  badge.textContent   = n;
  badge.style.display = n > 0 ? 'flex' : 'none';
}

function addToCartById(id) {
  const p = PRODUCTS[id];
  if (!p) return;
  const key      = id + '-default';
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ key, id, name: p.name, price: Number(p.base_price), qty: 1, img: p.image_url, options: '' });
  }
  updateCartBadge();
  if (currentPage === 'cart') renderCartPage();
}

function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  updateCartBadge();
  renderCartDrawer();
  if (currentPage === 'cart') renderCartPage();
}

function changeCartQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  updateCartBadge();
  renderCartDrawer();
  if (currentPage === 'cart') renderCartPage();
}

/* ----- Render cart in the slide-out drawer ----- */
function renderCartDrawer() {
  const container = document.getElementById('cart-drawer-items');
  const empty     = document.getElementById('cart-drawer-empty');
  const footer    = document.getElementById('cart-drawer-footer');

  if (cart.length === 0) {
    container.innerHTML   = '';
    empty.style.display   = 'flex';
    footer.style.display  = 'none';
    return;
  }

  empty.style.display  = 'none';
  footer.style.display = 'block';

  container.innerHTML = cart.map(item => `
    <div class="flex gap-4 items-center p-3 bg-surface-container-low rounded-2xl">
      <img src="${item.img}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt="${item.name}"/>
      <div class="flex-1 min-w-0">
        <p class="font-body-md font-semibold text-primary truncate">${item.name}</p>
        ${item.options ? `<p class="font-caption text-on-surface-variant">${item.options}</p>` : ''}
        <p class="font-label-md text-secondary">$${(item.price * item.qty).toFixed(2)}</p>
      </div>
      <div class="flex flex-col items-center gap-1">
        <div class="flex items-center gap-1 bg-surface rounded-full border border-outline-variant p-0.5">
          <button onclick="changeCartQty('${item.key}',-1)" class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container active:scale-90 transition-all">
            <span class="material-symbols-outlined text-sm">remove</span>
          </button>
          <span class="w-6 text-center font-body-md">${item.qty}</span>
          <button onclick="changeCartQty('${item.key}',1)" class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container active:scale-90 transition-all">
            <span class="material-symbols-outlined text-sm">add</span>
          </button>
        </div>
        <button onclick="removeFromCart('${item.key}')" class="font-caption text-error hover:underline">Remove</button>
      </div>
    </div>
  `).join('');

  document.getElementById('cart-subtotal-drawer').textContent = '$' + getCartTotal().toFixed(2);
}

/* ----- Render cart table on the full Cart page ----- */
function renderCartPage() {
  const itemsEl = document.getElementById('cart-page-items');
  const emptyEl = document.getElementById('cart-page-empty');
  const instrEl = document.getElementById('cart-instructions-section');

  if (cart.length === 0) {
    itemsEl.style.display = 'none';
    emptyEl.style.display = 'flex';
    instrEl.style.display = 'none';
  } else {
    itemsEl.style.display = 'block';
    emptyEl.style.display = 'none';
    instrEl.style.display = 'block';

    itemsEl.innerHTML = `
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[500px]">
          <thead class="bg-surface-container-highest/50">
            <tr>
              <th class="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">Item</th>
              <th class="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Options</th>
              <th class="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">Price</th>
              <th class="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider text-center">Qty</th>
              <th class="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/30">
            ${cart.map(item => `
              <tr class="hover:bg-white/40 transition-colors group">
                <td class="px-6 py-6">
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-highest flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <img src="${item.img}" class="w-full h-full object-cover" alt="${item.name}"/>
                    </div>
                    <div>
                      <h3 class="font-headline-sm text-lg text-primary">${item.name}</h3>
                      <button onclick="removeFromCart('${item.key}')" class="text-caption text-error mt-1 hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <span class="material-symbols-outlined text-sm">delete</span> Remove
                      </button>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-6 hidden md:table-cell">
                  <span class="font-caption text-on-surface-variant">${item.options || '—'}</span>
                </td>
                <td class="px-6 py-6 font-body-md text-primary">$${item.price.toFixed(2)}</td>
                <td class="px-6 py-6">
                  <div class="flex items-center justify-center gap-2">
                    <button onclick="changeCartQty('${item.key}',-1)" class="w-7 h-7 rounded-full border border-outline/30 flex items-center justify-center hover:bg-secondary/10 active:scale-90 transition-all">
                      <span class="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span class="font-body-md w-5 text-center">${item.qty}</span>
                    <button onclick="changeCartQty('${item.key}',1)" class="w-7 h-7 rounded-full border border-outline/30 flex items-center justify-center hover:bg-secondary/10 active:scale-90 transition-all">
                      <span class="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </td>
                <td class="px-6 py-6 text-right font-headline-sm text-xl text-primary">$${(item.price * item.qty).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="p-6 bg-surface-container-high/30 border-t border-outline-variant/20">
        <label class="block font-label-md text-on-surface-variant mb-2">Special Instructions for our Baristas</label>
        <textarea id="special-instructions" class="w-full bg-surface-container-low border-none rounded-lg p-4 font-body-md text-on-surface-variant focus:ring-2 focus:ring-secondary/20 h-24 transition-all resize-none" placeholder="e.g. Please leave room for cream, or pack pastries separately..."></textarea>
      </div>
    `;
  }
  updateOrderSummary();
}

function updateOrderSummary() {
  const total   = getCartTotal();
  const vatable = total / 1.12;
  const vat     = total - vatable;

  document.getElementById('order-subtotal').textContent = '₱' + vatable.toFixed(2);
  document.getElementById('order-tax').textContent      = '₱' + vat.toFixed(2);
  document.getElementById('order-total').textContent    = '₱' + total.toFixed(2);
}

function applyPromo() {
  const code = document.getElementById('promo-input').value.trim().toUpperCase();
  if      (code === 'KINGLAINE10') showToast('10% discount applied!', 'percent');
  else if (code === 'BREW')        showToast('Free shipping unlocked!', 'local_shipping');
  else                             showToast('Invalid promo code', 'error');
}

function checkout() {
  if (cart.length === 0) { showToast('Your basket is empty!', 'error'); return; }
  showToast('Order placed! See you soon. ☕', 'check_circle');
  setTimeout(() => {
    cart = [];
    updateCartBadge();
    if (currentPage === 'cart') renderCartPage();
  }, 1500);
}

/* =============================================
   MENU PAGE
   ============================================= */
function renderMenu(cat) {
  const products = productsByCategory(cat);
  const meta     = CATEGORY_META[cat] || { title: cat, desc: '' };

  document.getElementById('menu-category-title').textContent = meta.title;
  document.getElementById('menu-category-desc').textContent  = meta.desc;

  const grid = document.getElementById('menu-grid');
  grid.innerHTML = products.map(p => `
    <div class="product-card group relative bg-surface-container-low rounded-[2rem] p-6 border border-transparent hover:border-tertiary-fixed-dim transition-all cursor-pointer" onclick="openProductDetail('${p.id}')">
      <div class="relative w-full aspect-square mb-6 overflow-hidden rounded-2xl bg-surface-container">
        <img alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="${p.image_url || ''}"/>
      </div>
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-headline-sm text-xl text-primary">${p.name}</h3>
        <span class="font-label-md text-secondary">$${Number(p.base_price).toFixed(2)}</span>
      </div>
      <button onclick="event.stopPropagation(); addToCartById('${p.id}'); showToast('${p.name} added!','check')"
              class="w-full py-3 px-6 rounded-full bg-secondary text-on-secondary font-label-md flex items-center justify-center gap-2 hover:bg-primary transition-colors active:scale-95">
        <span class="material-symbols-outlined text-base">add</span> Add to cart
      </button>
    </div>
  `).join('');

  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('selected', 'bg-secondary-container', 'text-on-secondary-container');
    if (btn.dataset.cat === cat) btn.classList.add('selected', 'bg-secondary-container', 'text-on-secondary-container');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => renderMenu(btn.dataset.cat));
  });
});

/* =============================================
   PRODUCT DETAIL PAGE
   ============================================= */
function openProductDetail(id) {
  const p = PRODUCTS[id];
  if (!p) return;

  currentProduct       = p;
  currentProductQty    = 1;
  selectedOptionValues = {};

  document.getElementById('product-hero-img').src          = p.image_url || '';
  document.getElementById('product-hero-name').textContent = p.name;
  document.getElementById('detail-qty').textContent         = 1;

  /* ----- Sizes: pulled live from product_sizes for this product ----- */
  const sizes = SIZES_BY_PRODUCT[p.id] || [];
  selectedSizeId = sizes.length ? sizes[0].id : null;
  const sizeSection = document.getElementById('product-size-section');
  if (sizeSection) {
    sizeSection.style.display = sizes.length ? 'block' : 'none';
    document.getElementById('product-size-options').innerHTML = sizes.map(s => `
      <button class="size-btn ${s.id === selectedSizeId ? 'selected' : ''}" data-size="${s.id}" onclick="selectSize(this)">
        <span class="size-icon">${s.label}</span>
      </button>
    `).join('');
  }

  /* ----- Option groups (e.g. milk type): pulled live from option_groups/option_values ----- */
  const groups = OPTION_GROUPS_BY_PRODUCT[p.id] || [];
  groups.forEach(g => { if (g.values.length) selectedOptionValues[g.id] = g.values[0].id; });
  const optionsSection = document.getElementById('product-milk-section');
  if (optionsSection) {
    optionsSection.style.display = groups.length ? 'block' : 'none';
    optionsSection.querySelector('[data-options-list]')?.replaceChildren();
    document.getElementById('product-milk-options').innerHTML = groups.map(g => `
      <div class="mb-3">
        <p class="text-xs font-bold uppercase tracking-wider mb-2">${g.name}</p>
        ${g.values.map(v => `
          <button class="milk-btn ${v.id === selectedOptionValues[g.id] ? 'selected' : ''}" onclick="selectOptionValue('${g.id}','${v.id}', this)">
            ${v.label}${v.price_delta ? ` (+$${v.price_delta.toFixed(2)})` : ''}
          </button>
        `).join('')}
      </div>
    `).join('');
  }

  /* ----- Add-ons: pulled live from addons table ----- */
  const addonsSection = document.getElementById('product-addons-section');
  if (addonsSection) {
    addonsSection.style.display = ADDONS.length ? 'block' : 'none';
    document.getElementById('product-addons-list').innerHTML = ADDONS.map(a => `
      <label class="flex items-center gap-2">
        <input type="checkbox" data-addon-id="${a.id}" onchange="updateProductPrice()"/> ${a.label} (+$${a.price.toFixed(2)})
      </label>
    `).join('');
  }

  updateProductPrice();
  navigate('product');
}

function selectSize(btn) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedSizeId = btn.dataset.size;
  updateProductPrice();
}

function selectOptionValue(groupId, valueId, btn) {
  btn.parentElement.querySelectorAll('.milk-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedOptionValues[groupId] = valueId;
  updateProductPrice();
}

function changeDetailQty(delta) {
  currentProductQty = Math.max(1, currentProductQty + delta);
  document.getElementById('detail-qty').textContent = currentProductQty;
  updateProductPrice();
}

/* Mirrors the pricing model used in the POS terminal:
   a size's price (from product_sizes) IS the sized base price for
   this product — it's not a flat add-on — then option/add-on deltas
   are added on top. */
function calcUnitPrice() {
  if (!currentProduct) return 0;
  const sizes = SIZES_BY_PRODUCT[currentProduct.id] || [];
  const sizeMatch = sizes.find(s => s.id === selectedSizeId);
  const base = sizeMatch ? sizeMatch.price : Number(currentProduct.base_price);

  let optionTotal = 0;
  (OPTION_GROUPS_BY_PRODUCT[currentProduct.id] || []).forEach(g => {
    const v = g.values.find(v => v.id === selectedOptionValues[g.id]);
    if (v) optionTotal += v.price_delta;
  });

  let addonTotal = 0;
  document.querySelectorAll('#product-addons-list input:checked').forEach(cb => {
    const a = ADDONS.find(x => x.id === cb.dataset.addonId);
    if (a) addonTotal += a.price;
  });

  return base + optionTotal + addonTotal;
}

function updateProductPrice() {
  if (!currentProduct) return;
  document.getElementById('product-total-price').textContent = '$' + (calcUnitPrice() * currentProductQty).toFixed(2);
}

function addDetailItemToCart() {
  if (!currentProduct) return;
  const unitPrice = calcUnitPrice();

  const opts = [];
  const sizeMatch = (SIZES_BY_PRODUCT[currentProduct.id] || []).find(s => s.id === selectedSizeId);
  if (sizeMatch) opts.push(sizeMatch.label);
  (OPTION_GROUPS_BY_PRODUCT[currentProduct.id] || []).forEach(g => {
    const v = g.values.find(v => v.id === selectedOptionValues[g.id]);
    if (v) opts.push(v.label);
  });
  document.querySelectorAll('#product-addons-list input:checked').forEach(cb => {
    const a = ADDONS.find(x => x.id === cb.dataset.addonId);
    if (a) opts.push(a.label);
  });
  const optLabel = opts.join(', ');

  const key      = currentProduct.id + '-' + selectedSizeId + '-' + Object.values(selectedOptionValues).join(',');
  const existing = cart.find(i => i.key === key);

  if (existing) {
    existing.qty += currentProductQty;
  } else {
    cart.push({
      key, id: currentProduct.id, name: currentProduct.name, price: unitPrice,
      qty: currentProductQty, img: currentProduct.image_url, options: optLabel
    });
  }

  updateCartBadge();
  showToast(currentProduct.name + ' added to basket!', 'check');
  navigate('menu');
}

/* =============================================
   REWARDS / PROFILE PAGE
   (unchanged — still front-end only, no rewards table in the DB yet)
   ============================================= */
function renderRewards() {
  const beanContainer = document.getElementById('loyalty-beans');
  beanContainer.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    const span = document.createElement('span');
    span.className   = 'material-symbols-outlined text-3xl bean-fill';
    span.textContent = 'coffee';

    if (i < 8) {
      span.style.cssText = "font-variation-settings: 'FILL' 1; color: #7d562d; opacity:0; transform: scale(0) rotate(-45deg)";
      setTimeout(() => {
        span.style.opacity   = '1';
        span.style.transform = 'scale(1) rotate(0deg)';
      }, 80 * (i + 1));
    } else {
      span.style.cssText = "color: #d3c3bd; opacity:0.4;";
    }
    beanContainer.appendChild(span);
  }

  const recentOrders = [
    { icon: 'coffee',        name: 'Oat Milk Cortado',   branch: 'Downtown Branch', date: 'Oct 24', price: '$5.50', pts: 10 },
    { icon: 'bakery_dining', name: 'Almond Croissant',   branch: 'Westside Hub',    date: 'Oct 21', price: '$4.75', pts:  8 },
    { icon: 'coffee',        name: 'Midnight Cold Brew', branch: 'Downtown Branch', date: 'Oct 18', price: '$6.25', pts: 12 }
  ];

  document.getElementById('recent-orders-list').innerHTML = recentOrders.map(o => `
    <div class="flex items-center justify-between p-4 bg-surface rounded-2xl border border-surface-container-highest/30 hover:bg-surface-container-low transition-colors">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-surface-container-highest rounded-xl flex items-center justify-center text-primary">
          <span class="material-symbols-outlined">${o.icon}</span>
        </div>
        <div>
          <h4 class="font-body-md font-bold text-primary">${o.name}</h4>
          <p class="text-caption text-on-surface-variant">${o.date} · ${o.branch}</p>
        </div>
      </div>
      <div class="text-right">
        <span class="block font-body-md font-bold text-primary">${o.price}</span>
        <span class="text-caption text-secondary font-bold">+${o.pts} pts</span>
      </div>
    </div>
  `).join('');
}

function claimReward()  { showToast('Free Artisan Latte claimed! Show at counter.', 'redeem'); }
function redeemPoints() {
  showToast('2,450 points redeemed for $24.50 credit!', 'savings');
  document.getElementById('reward-points').textContent = '0';
}

/* =============================================
   INITIALISE
   ============================================= */
(async function init() {
  await loadCatalog();
  navigate('home');
})();
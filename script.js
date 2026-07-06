/* =============================================
   KINGLAINE COFFEE & BREW — script.js
   ============================================= */

/* ===== PRODUCT DATABASE ===== */
const PRODUCTS = {
  'velvet-caramel': {
    id: 'velvet-caramel', name: 'Velvet Caramel Macchiato', price: 5.95,
    desc: 'Slow-roasted espresso layered with artisanal salted caramel and steamed micro-foam.',
    cat: 'coffee',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB88dUq1CfOGYe9Q3qu9AVNb4VVPpomAFWT_-WOPUM0Jr2kAatS_GtatPBxZ59GGyBQ9NTKQl9KnsLsnRDQEdZk3U7IJOlwpHLUcmzvcSuSmOB0HpxZf-cps_5PYW7v9wzy5AByEQIb0hk8TNKgXQCeo-IrRYb8UPi-t71uoVPT_Qra9GZFKkYybg8B70kDbhpxRYqJV7LNRd6En3_05ueQTuTPeCwnn0UGO2blNn-RKZ2zZBJHmtmPQ4-sfL72N930dFa9YOCx3dCk',
    rating: 4.9, reviews: 98, hasOptions: true
  },
  'classic-latte': {
    id: 'classic-latte', name: 'Classic Latte', price: 4.50,
    desc: 'Velvety steamed milk over our house-blend espresso.',
    cat: 'coffee',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGVjEjcDV63Ku3CKzk5O12roY5kP5_T5F14tGTKANFUjSB4SUTTSaguAXoozjIgA7hQI8qYtEW29zPFRe9Z4KhNCn2rSNSrMbmLVKgQUqgjkR97fOO3RWMCQEFeFK7JperA-DQABDo5ShRAwrOTmAQnESqEIGLcOM1JztDoQIlGhcIBamA05a6KoKAYmCNrJFfkDOq3k1IyNFG7ONiXVTgdKt2EH-UOGM1qRbRXWCh5N6M8SleAvCs2s30NNJ5rIqlP3wxsaVHO8r8',
    rating: 4.8, reviews: 120, hasOptions: true
  },
  'butter-croissant': {
    id: 'butter-croissant', name: 'Butter Croissant', price: 3.75,
    desc: 'Hand-laminated dough, baked fresh every morning.',
    cat: 'bakery',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu_rlyXbRtHplsmpGCZl-VG3BpN-15lx80Z_zP7yHHCyj6bWY9qZpODolDpFquBAWCKxkkDjsatDhDIYGn8klh_jdJ_SIMzKFAhNDDTPFqINyK9TbnW5KIhzX_QWJ4qzUCvLZpaMQI2PgXBdmZgOePcoS3uE2UqhYwyR4sbBerSVUfFBaS2225Fq3JCIAQjtabY9Nv0cwBtNfOZhy0Qlk4o27WQEDzykyhb5sL4OpmQ8olxUmsWDfTvlzFxB1uRVbUrY46bNXyPTeS',
    rating: 4.7, reviews: 88, hasOptions: false
  },
  'cold-brew-reserve': {
    id: 'cold-brew-reserve', name: 'Cold Brew Reserve', price: 5.25,
    desc: '18-hour steep, single-origin Ethiopian beans.',
    cat: 'coffee',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT4Kty7AIUj37iynd3v7XZSNr-ZsJxGA1azPHOnX6U0Lse3pdkdtlOKILJuuXxwQGUXr-tAA50rWj5ORmNEOk66ihlxDRBIWBdiyKvMeGvapDasL4F1UCiZDlmkLaV7-MJy2FA2d53XNQOmy3PLISxocXrFAPWfjlavHurkiWK41bZcPxenFLU3iSCwZ8u9G-wTEr5GnHlSxB_1I1qFIn-gCaYdQEIwQFXf-ufT8ZINPjpQ9LdUsct05YdOXi25Snyr69FC6rnuPBY',
    rating: 4.8, reviews: 85, hasOptions: false
  },
  'velvet-latte': {
    id: 'velvet-latte', name: 'Velvet Latte', price: 5.75,
    desc: 'Double shot of house espresso with steamed silky milk and a hint of vanilla bean syrup.',
    cat: 'coffee',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC__wa2baWIqhhVSPFbp9q0ry0do9Z0df_eMM67X8UTbWTplMN-4A8Jk-h4Q71IuFFi-qgjc1Ou1pUSuTnMYxfexFOizabegjTRMBTM_Jvwrj0aJmmdVzfyw_U2CR-22CeZMaM_DOVwXo-P-97HneNXIfpjPUVJ5EqgXn7kxmDfpLyeIK6OgYZ8vF9FulAo58_Ts39c80iWbyQ96OlBrjIBys7-VSoxd9BjrUB0LHHIXKpi3iKN3fyeXp7diA37W4MpXajVK5u82R07',
    rating: 4.9, reviews: 120, hasOptions: true
  },
  'midnight-cold-brew': {
    id: 'midnight-cold-brew', name: 'Midnight Cold Brew', price: 6.25,
    desc: '18-hour slow-steeped Ethiopian beans with notes of dark chocolate and stone fruit.',
    cat: 'coffee',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAF0J2Ov8pWeoG1dEjsbvHOPG0ojjhwC9Ou3AdxeoH9OcI1UmQrpZZn1lL6PaUgd6yONFxTKSo_clrYZrJPXTrkPSbPtB3neZKlXTBjVB1dtGeAH3uPtUXBZEzTU0f7puOewV5kHHh4ICQWCkKoHtP0rKDXuYPPjfv9dHu8vu1DYR4UdWkec0hOsbt7kvp4jiRWhCiBtp_BN8Y17R3AgdbkZTbuqUwraRZfNf1O7275Hsa8esVeReNwqKuRWGAmqo3jXSD_8lrBJO2',
    rating: 4.8, reviews: 85, hasOptions: false
  },
  'pistachio-cortado': {
    id: 'pistachio-cortado', name: 'Pistachio Cortado', price: 5.25,
    desc: 'Equal parts espresso and warm milk with house-made roasted pistachio cream.',
    cat: 'coffee',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsDquNpPKio-sFGgOSPFZKxyfNtZn3H24PfTphqp0dQfvti-svoJ6JM1_MEqRDifi2lcf9cMj5-PGT_MJ0emsTjRmsdFK6fIprZodd8754Sbf3iYfHRNwfbkGZsu2NgZjcsA4mjIdfyTN_NBw7e1hxTkOYhMuydG3jNkGdAqHm8UIw_AkCkapwcFEVVEgQGit8Kdit5mNgJvMb8lkHj6L3Af1HBZ3escAgqmUV-gxLPklrum1cMbFnMtQIj5lJQ0u91xG4qnvrLOeX',
    rating: 5.0, reviews: 42, hasOptions: true
  },
  'origin-pour-over': {
    id: 'origin-pour-over', name: 'Origin Pour Over', price: 7.00,
    desc: 'Rotating single-origin selection brewed manually for complex clarity of flavor.',
    cat: 'coffee',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa64ycw811Woo-a7WyD7xaUlmosX_acrEn5WXM4kN8lJpMELQhUhy3pSH52G4ePOjOwYziwaumzo9SDBtWwfXeXerldheYhGhlZ8jyuTsGq01DIGvUVgJrXmBQPJi0S2tVw6gvXYmQXNC1wtxi_IIFc9zP-_ya_1KHX7TwH3AfT85oY-wGoGvR2oEnllvM7t5rX-3MnQ4Jsd1-K1zFIaS25X1KQbJhaQeMlhrStJ3raiHGpwYxbW_UEadzE2mBukNwJTQTM_IkCkYu',
    rating: 4.7, reviews: 56, hasOptions: true
  },
  'almond-croissant': {
    id: 'almond-croissant', name: 'Almond Croissant', price: 4.50,
    desc: 'Twice-baked buttery pastry filled with sweet almond frangipane and topped with toasted flakes.',
    cat: 'bakery',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmFc7aTlA-kfog0q357Wd-VRbEb_FPwWjcloaqSUzIa0Kc6Hp_Nw8daPmVsspiRHsyeFRIfHguvh9Gw5i4p__DlMvNEeD4zY0AM1uFHXueZMD_ERIAwvkizy2CTbuO93_QBmgRM7biSakE2HFwx5bsJ5f6fJh_DbnNjCA_xyvsQ2FChlAQdUcwfXNB18kArY7jxwE-ZIyZfNFc8ibRIBs0wJKcil98-2a8TT8PtipAoWQTXGaDdYIxLuKOwvffT0jprY8KE7G2sfHx',
    rating: 4.9, reviews: 210, hasOptions: false
  },
  'artisan-macarons': {
    id: 'artisan-macarons', name: 'Artisan Macarons', price: 12.00,
    desc: 'Set of 6 delicate almond shells with seasonal ganache fillings. Handcrafted daily.',
    cat: 'bakery',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdECi4qDHsPjKD6EA7a3yq1iq6C0nUpgPVTHfP8-LbSyeNq1hoCspwZu1GXjXrxHSJgDDaA0ipoZghVEinoRKaRG4NQO2HHdr89POtjTwDQpXTNTNRzUF6IgQOKHqiqnJiTxfs6zCmhGjJZyVLsNUMH0aHPxse58O7gSzzbLdyssc5drJTem8qjid2pv-czAFQbAN6anLNHcr9LJonXjbsMbXZLPkl6ERYbUIyLXLtFm4_n3C9PBWjuKhsDfr12jU7kNeTPhv857L6',
    rating: 4.6, reviews: 34, hasOptions: false
  },
  'chamomile-honey': {
    id: 'chamomile-honey', name: 'Chamomile Honey Tea', price: 4.00,
    desc: 'Organic chamomile blossoms steeped with local wildflower honey.',
    cat: 'tea',
    img: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=600',
    rating: 4.5, reviews: 62, hasOptions: false
  },
  'matcha-latte': {
    id: 'matcha-latte', name: 'Ceremonial Matcha', price: 5.50,
    desc: 'Grade-A ceremonial matcha whisked with steamed oat milk. Earthy, smooth, and grounding.',
    cat: 'tea',
    img: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600',
    rating: 4.7, reviews: 91, hasOptions: true
  },
  'brew-mug': {
    id: 'brew-mug', name: 'Kinglaine Brew Mug', price: 28.00,
    desc: '12oz hand-thrown ceramic mug with the Kinglaine crest. Dishwasher safe.',
    cat: 'merch',
    img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
    rating: 4.9, reviews: 44, hasOptions: false
  },
  'beans-250g': {
    id: 'beans-250g', name: 'House Blend Beans 250g', price: 18.00,
    desc: 'Our signature house blend, freshly roasted the day of shipping. Medium roast.',
    cat: 'merch',
    img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600',
    rating: 5.0, reviews: 33, hasOptions: false
  }
};

/* ===== CATEGORY METADATA ===== */
const CATEGORY_META = {
  coffee: { title: 'Signature Coffee',  desc: 'Ethically sourced, small-batch roasted beans curated for the ultimate sensory experience.' },
  tea:    { title: 'Artisan Teas',      desc: 'Carefully sourced whole-leaf teas and seasonal blends, steeped to perfection.' },
  bakery: { title: 'The Bakery',        desc: 'Hand-crafted pastries baked fresh each morning from stone-milled flour.' },
  merch:  { title: 'Merchandise',       desc: 'Bring the Kinglaine experience home. Mugs, beans, and barista essentials.' }
};

/* ===== CART STATE ===== */
let cart            = [];
let currentPage     = 'home';
let currentProduct  = null;
let currentProductQty = 1;
let selectedSize    = 'medium';
let selectedMilk    = 'Whole Milk';
const sizePriceAdds = { small: -0.50, medium: 0, large: 0.75 };

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

function addToCartById(id, opts = {}) {
  const p = PRODUCTS[id];
  if (!p) return;
  const key      = id + (opts.size || '') + (opts.milk || '');
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      key,
      id,
      name:    p.name,
      price:   p.price + (opts.priceAdd || 0),
      qty:     1,
      img:     p.img,
      options: opts.label || ''
    });
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
  const sub   = getCartTotal();
  const tax   = sub * 0.085;
  const fee   = 0.50;
  const total = sub + tax + fee;
  document.getElementById('order-subtotal').textContent = '$' + sub.toFixed(2);
  document.getElementById('order-tax').textContent      = '$' + tax.toFixed(2);
  document.getElementById('order-total').textContent    = '$' + total.toFixed(2);
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
  const products = Object.values(PRODUCTS).filter(p => p.cat === cat);
  const meta     = CATEGORY_META[cat];

  document.getElementById('menu-category-title').textContent = meta.title;
  document.getElementById('menu-category-desc').textContent  = meta.desc;

  const grid = document.getElementById('menu-grid');
  grid.innerHTML = products.map(p => `
    <div class="product-card group relative bg-surface-container-low rounded-[2rem] p-6 border border-transparent hover:border-tertiary-fixed-dim transition-all cursor-pointer" onclick="openProductDetail('${p.id}')">
      <div class="relative w-full aspect-square mb-6 overflow-hidden rounded-2xl bg-surface-container">
        <img alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="${p.img}"/>
      </div>
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-headline-sm text-xl text-primary">${p.name}</h3>
        <span class="font-label-md text-secondary">$${p.price.toFixed(2)}</span>
      </div>
      <div class="flex items-center gap-1 mb-4">
        <span class="material-symbols-outlined text-secondary text-base star-filled">star</span>
        <span class="font-caption text-on-surface">${p.rating} (${p.reviews}+)</span>
      </div>
      <p class="font-body-md text-on-surface-variant mb-6 line-clamp-2">${p.desc}</p>
      <button onclick="event.stopPropagation(); addToCartById('${p.id}'); showToast('${p.name} added!','check')"
              class="w-full py-3 px-6 rounded-full bg-secondary text-on-secondary font-label-md flex items-center justify-center gap-2 hover:bg-primary transition-colors active:scale-95">
        <span class="material-symbols-outlined text-base">add</span> Add to cart
      </button>
    </div>
  `).join('');

  /* Update sidebar category buttons */
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('selected', 'bg-secondary-container', 'text-on-secondary-container');
    if (btn.dataset.cat === cat) {
      btn.classList.add('selected', 'bg-secondary-container', 'text-on-secondary-container');
    }
  });
}

/* Attach category sidebar click handlers after DOM is ready */
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

  currentProduct    = p;
  currentProductQty = 1;
  selectedSize      = 'medium';
  selectedMilk      = 'Whole Milk';

  document.getElementById('product-hero-img').src         = p.img;
  document.getElementById('product-hero-name').textContent = p.name;
  document.getElementById('product-hero-desc').textContent = p.desc;
  document.getElementById('detail-qty').textContent        = 1;

  /* Reset size buttons */
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  document.querySelector('.size-btn[data-size="medium"]').classList.add('selected');

  /* Reset milk buttons */
  document.querySelectorAll('.milk-btn').forEach(b => {
    b.classList.remove('selected');
    b.classList.add('border-outline-variant');
  });
  document.querySelector('.milk-btn').classList.add('selected');

  /* Reset add-on checkboxes */
  document.getElementById('addon-espresso').checked = false;
  document.getElementById('addon-caramel').checked  = false;

  /* Show / hide milk & add-ons for non-coffee items */
  const hasMilk = p.hasOptions;
  document.getElementById('product-milk-section').style.display   = hasMilk ? 'block' : 'none';
  document.getElementById('product-addons-section').style.display = hasMilk ? 'block' : 'none';

  updateProductPrice();
  navigate('product');
}

function selectSize(btn) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedSize = btn.dataset.size;
  updateProductPrice();
}

function selectMilk(btn) {
  document.querySelectorAll('.milk-btn').forEach(b => {
    b.classList.remove('selected');
    b.classList.add('border-outline-variant');
    b.classList.remove('border-secondary');
  });
  btn.classList.add('selected');
  btn.classList.remove('border-outline-variant');
  btn.classList.add('border-secondary');
  selectedMilk = btn.textContent.trim();
}

function changeDetailQty(delta) {
  currentProductQty = Math.max(1, currentProductQty + delta);
  document.getElementById('detail-qty').textContent = currentProductQty;
  updateProductPrice();
}

function updateProductPrice() {
  if (!currentProduct) return;
  const base     = currentProduct.price;
  const sizeAdd  = sizePriceAdds[selectedSize] || 0;
  const espresso = document.getElementById('addon-espresso')?.checked ? 0.95 : 0;
  const caramel  = document.getElementById('addon-caramel')?.checked  ? 0.60 : 0;
  const total    = (base + sizeAdd + espresso + caramel) * currentProductQty;
  document.getElementById('product-total-price').textContent = '$' + total.toFixed(2);
}

function addDetailItemToCart() {
  if (!currentProduct) return;
  const base     = currentProduct.price;
  const sizeAdd  = sizePriceAdds[selectedSize] || 0;
  const espresso = document.getElementById('addon-espresso')?.checked ? 0.95 : 0;
  const caramel  = document.getElementById('addon-caramel')?.checked  ? 0.60 : 0;
  const unitPrice = base + sizeAdd + espresso + caramel;

  const sizeLabel = selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1);
  const opts = [sizeLabel];
  if (currentProduct.hasOptions) opts.push(selectedMilk);
  if (espresso) opts.push('Extra Shot');
  if (caramel)  opts.push('Caramel');
  const optLabel = opts.join(', ');

  const key      = currentProduct.id + selectedSize + selectedMilk + (espresso ? 'e' : '') + (caramel ? 'c' : '');
  const existing = cart.find(i => i.key === key);

  if (existing) {
    existing.qty += currentProductQty;
  } else {
    cart.push({
      key,
      id:      currentProduct.id,
      name:    currentProduct.name,
      price:   unitPrice,
      qty:     currentProductQty,
      img:     currentProduct.img,
      options: optLabel
    });
  }

  updateCartBadge();
  showToast(currentProduct.name + ' added to basket!', 'check');
  navigate('menu');
}

/* =============================================
   REWARDS / PROFILE PAGE
   ============================================= */
function renderRewards() {
  /* Animated loyalty beans */
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

  /* Recent orders list */
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

function claimReward() {
  showToast('Free Artisan Latte claimed! Show at counter.', 'redeem');
}

function redeemPoints() {
  showToast('2,450 points redeemed for $24.50 credit!', 'savings');
  document.getElementById('reward-points').textContent = '0';
}

/* =============================================
   INITIALISE
   ============================================= */
navigate('home');
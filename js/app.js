/**
 * IAN ARTS — STUDIO KIMEMIA
 * Master Interactive Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentCurrency: 'USD',
    currentFilter: 'all',
    viewMode: 'mockup', // 'mockup' or 'artwork'
    cart: JSON.parse(localStorage.getItem('ian_arts_cart')) || [],
    promoDiscount: 0, // e.g. 0.1 for 10%
    isShiftPaused: false,
    selectedArtwork: null,
    selectedSize: '16x20',
    selectedFrame: 'framed-black',
    selectedBundle: 1
  };

  // Pricing Matrix Multipliers
  const SIZE_CONFIG = {
    '12x16': { label: '12 × 16" (Collector Mini)', mult: 0.8 },
    '16x20': { label: '16 × 20" (Standard Exhibition)', mult: 1.0 },
    '18x24': { label: '18 × 24" (Large Gallery)', mult: 1.25 },
    '24x36': { label: '24 × 36" (Grand Statement)', mult: 1.6 },
    'original': { label: 'Original Masterpiece (Full Scale)', isOriginal: true }
  };

  const FRAME_CONFIG = {
    'unframed': { label: 'Archival Fine Art Paper (Unframed)', cost: 0 },
    'framed-black': { label: 'Matte Black Gallery Wood Frame', cost: 45 },
    'framed-oak': { label: 'Warm Natural Oak Wood Frame', cost: 55 },
    'canvas': { label: 'Museum Stretched Gallery Canvas', cost: 35 }
  };

  // Helper: Format Price with Selected Currency
  function formatPrice(usdAmount) {
    const cur = CURRENCIES[state.currentCurrency];
    const converted = usdAmount * cur.rate;
    if (state.currentCurrency === 'KES') {
      return `${cur.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${cur.symbol}${converted.toFixed(2)}`;
  }

  // =========================================================================
  // 1. RENDER SHIFTING EXHIBITION (HERO MOVING GALLERY)
  // =========================================================================
  const shiftTrack = document.getElementById('shiftingTrack');
  const shiftStatusPill = document.getElementById('shiftStatusPill');
  const shiftToggleBtn = document.getElementById('shiftToggleBtn');

  function renderShiftingTrack() {
    if (!shiftTrack) return;
    
    // Duplicate artworks array to ensure seamless infinite shift loop
    const displayList = [...ARTWORKS, ...ARTWORKS];
    shiftTrack.innerHTML = '';

    displayList.forEach((art, index) => {
      const card = document.createElement('div');
      card.className = 'shift-card';
      card.dataset.id = art.id;

      card.innerHTML = `
        <div class="shift-image-wrapper">
          <img src="${art.images.mockup}" alt="${art.title}" loading="lazy" />
          <span class="shift-badge-floating">${art.badge}</span>
          <span class="shift-room-indicator">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            In Modern Space
          </span>
        </div>
        <div class="shift-card-info">
          <div class="shift-card-header">
            <div>
              <h3 class="shift-piece-title">${art.title}</h3>
              <p class="shift-piece-meta">${art.medium}</p>
            </div>
            <div class="shift-piece-price">${formatPrice(art.basePrice)}</div>
          </div>
          <div class="shift-card-actions">
            <button class="btn-inspect" data-id="${art.id}">
              Inspect Artwork ↗
            </button>
            <button class="btn-quick-add" data-id="${art.id}">
              Collect Print
            </button>
          </div>
        </div>
      `;

      card.querySelector('.btn-inspect').addEventListener('click', (e) => {
        e.stopPropagation();
        openProductModal(art.id);
      });

      card.querySelector('.btn-quick-add').addEventListener('click', (e) => {
        e.stopPropagation();
        openProductModal(art.id);
      });

      card.addEventListener('click', () => {
        openProductModal(art.id);
      });

      shiftTrack.appendChild(card);
    });
  }

  // Toggle Shifting Pause/Play
  if (shiftToggleBtn) {
    shiftToggleBtn.addEventListener('click', () => {
      state.isShiftPaused = !state.isShiftPaused;
      shiftTrack.style.animationPlayState = state.isShiftPaused ? 'paused' : 'running';
      shiftToggleBtn.innerHTML = state.isShiftPaused ? '▶ Resume' : '⏸ Pause';
      if (shiftStatusPill) {
        shiftStatusPill.textContent = state.isShiftPaused ? 'Exhibition Paused' : 'Live Curated Exhibition';
      }
    });
  }

  // =========================================================================
  // 2. RENDER CATALOG ARTWORKS GRID
  // =========================================================================
  const artworkGrid = document.getElementById('artworkGrid');

  function renderArtworkGrid() {
    if (!artworkGrid) return;
    artworkGrid.innerHTML = '';

    const filtered = ARTWORKS.filter(art => {
      if (state.currentFilter === 'all') return true;
      if (state.currentFilter === 'drawings') return art.category === 'drawings';
      if (state.currentFilter === 'canvas') return art.category === 'canvas';
      if (state.currentFilter === 'contemporary') return art.category === 'contemporary';
      if (state.currentFilter === 'originals') return art.isOriginalAvailable;
      return true;
    });

    filtered.forEach(art => {
      const card = document.createElement('div');
      card.className = 'art-card';
      card.dataset.id = art.id;

      const primaryImg = state.viewMode === 'mockup' ? art.images.mockup : art.images.artwork;
      const secondaryImg = state.viewMode === 'mockup' ? art.images.artwork : art.images.mockup;

      card.innerHTML = `
        <div class="art-media">
          <img class="img-primary" src="${primaryImg}" alt="${art.title}" loading="lazy" />
          <img class="img-secondary" src="${secondaryImg}" alt="${art.title} secondary" loading="lazy" />
          <span class="art-badge-tag">${art.badge}</span>
          <div class="art-card-overlay">
            <button class="btn-card-action btn-quick-view" data-id="${art.id}">Quick View</button>
            <button class="btn-card-action btn-curator-view" data-id="${art.id}">Room Mockup</button>
          </div>
        </div>
        <div class="art-details">
          <div class="art-rating">
            ★★★★★ <span>(${art.reviewCount} collector reviews)</span>
          </div>
          <h3 class="art-title">${art.title}</h3>
          <p class="art-subtitle">${art.subtitle}</p>
          <div class="art-price-row">
            <span class="art-price-label">${art.isOriginalAvailable ? 'Prints & Original' : 'Prints'}</span>
            <span class="art-price-value">From ${formatPrice(art.basePrice)}</span>
          </div>
        </div>
      `;

      // Event Listeners on Card
      card.querySelector('.art-media').addEventListener('click', () => openProductModal(art.id));
      card.querySelector('.btn-quick-view').addEventListener('click', (e) => {
        e.stopPropagation();
        openProductModal(art.id);
      });
      card.querySelector('.btn-curator-view').addEventListener('click', (e) => {
        e.stopPropagation();
        openProductModal(art.id, 'mockup');
      });

      artworkGrid.appendChild(card);
    });
  }

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentFilter = btn.dataset.filter;
      renderArtworkGrid();
    });
  });

  // View Mode Buttons (Room vs Artwork)
  const viewModeBtns = document.querySelectorAll('.view-mode-btn');
  viewModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.viewMode = btn.dataset.mode;
      renderArtworkGrid();
    });
  });

  // Currency Selectors (Announcement + Header)
  const currencySelects = document.querySelectorAll('.currency-select');
  currencySelects.forEach(select => {
    select.value = state.currentCurrency;
    select.addEventListener('change', (e) => {
      state.currentCurrency = e.target.value;
      currencySelects.forEach(s => s.value = state.currentCurrency);
      renderShiftingTrack();
      renderArtworkGrid();
      if (state.selectedArtwork) updateModalPrice();
      renderCartItems();
    });
  });

  // =========================================================================
  // 3. PRODUCT DETAIL MODAL CONTROLLER
  // =========================================================================
  const productModalBackdrop = document.getElementById('productModalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalMainImage = document.getElementById('modalMainImage');
  const modalThumbnails = document.getElementById('modalThumbnails');
  const modalTitle = document.getElementById('modalTitle');
  const modalCurrentPrice = document.getElementById('modalCurrentPrice');
  const modalOriginalPrice = document.getElementById('modalOriginalPrice');
  const modalMedium = document.getElementById('modalMedium');
  const modalDimensions = document.getElementById('modalDimensions');
  const modalStoryText = document.getElementById('modalStoryText');
  const btnAddToCartLarge = document.getElementById('btnAddToCartLarge');
  const btnExpressBuy = document.getElementById('btnExpressBuy');

  function openProductModal(artId, preferredView = 'mockup') {
    const art = ARTWORKS.find(a => a.id === artId);
    if (!art) return;

    state.selectedArtwork = art;
    state.selectedSize = '16x20';
    state.selectedFrame = 'framed-black';
    state.selectedBundle = 1;

    // Set Text Details
    modalTitle.textContent = art.title;
    modalMedium.textContent = art.medium;
    modalDimensions.textContent = art.dimensions;
    modalStoryText.textContent = art.description;

    // Set Thumbnails
    modalThumbnails.innerHTML = '';
    const imagesList = [
      { key: 'mockup', label: 'Living Room Mockup', src: art.images.mockup },
      { key: 'artwork', label: 'Full Masterpiece', src: art.images.artwork },
      { key: 'detail', label: 'Close-up Texture', src: art.images.detail }
    ];

    imagesList.forEach((imgObj, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `thumb-item ${imgObj.key === preferredView ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${imgObj.src}" alt="${imgObj.label}" />`;
      thumb.addEventListener('click', () => {
        document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        modalMainImage.src = imgObj.src;
      });
      modalThumbnails.appendChild(thumb);
    });

    // Set Active Main Image
    modalMainImage.src = art.images[preferredView] || art.images.mockup;

    // Reset Option Pills UI
    setupOptionPillListeners();
    updateModalPrice();

    productModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    productModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProductModal);
  if (productModalBackdrop) {
    productModalBackdrop.addEventListener('click', (e) => {
      if (e.target === productModalBackdrop) closeProductModal();
    });
  }

  function setupOptionPillListeners() {
    // Size Buttons
    const sizeBtns = document.querySelectorAll('.size-pill-btn');
    sizeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === state.selectedSize);
      btn.onclick = () => {
        sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedSize = btn.dataset.size;
        updateModalPrice();
      };
    });

    // Frame Buttons
    const frameBtns = document.querySelectorAll('.frame-pill-btn');
    frameBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.frame === state.selectedFrame);
      btn.onclick = () => {
        frameBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedFrame = btn.dataset.frame;
        updateModalPrice();
      };
    });

    // Bundle Options (Buy 1, Buy 2 15% off, Buy 3 20% off)
    const bundleOptions = document.querySelectorAll('.bundle-option');
    bundleOptions.forEach(opt => {
      const count = parseInt(opt.dataset.bundle);
      opt.classList.toggle('active', count === state.selectedBundle);
      const radio = opt.querySelector('.bundle-radio');
      if (radio) radio.checked = count === state.selectedBundle;

      opt.onclick = () => {
        bundleOptions.forEach(b => {
          b.classList.remove('active');
          const r = b.querySelector('.bundle-radio');
          if (r) r.checked = false;
        });
        opt.classList.add('active');
        if (radio) radio.checked = true;
        state.selectedBundle = count;
        updateModalPrice();
      };
    });
  }

  function calculateItemUnitPrice(art, sizeKey, frameKey) {
    if (sizeKey === 'original') {
      return art.originalPrice || 2500;
    }
    const sizeMult = SIZE_CONFIG[sizeKey]?.mult || 1.0;
    const frameCost = FRAME_CONFIG[frameKey]?.cost || 0;
    return (art.basePrice * sizeMult) + frameCost;
  }

  function updateModalPrice() {
    if (!state.selectedArtwork) return;

    const unitPrice = calculateItemUnitPrice(state.selectedArtwork, state.selectedSize, state.selectedFrame);
    const quantity = state.selectedBundle;
    const rawTotal = unitPrice * quantity;

    let discountRate = 0;
    if (quantity === 2) discountRate = 0.15;
    if (quantity >= 3) discountRate = 0.20;

    const finalTotal = rawTotal * (1 - discountRate);

    modalCurrentPrice.textContent = formatPrice(finalTotal);
    if (discountRate > 0) {
      modalOriginalPrice.style.display = 'inline-block';
      modalOriginalPrice.textContent = formatPrice(rawTotal);
    } else {
      modalOriginalPrice.style.display = 'none';
    }

    // Update bundle pills price labels
    const b1Price = unitPrice;
    const b2Price = (unitPrice * 2) * 0.85;
    const b3Price = (unitPrice * 3) * 0.80;

    const b1Now = document.getElementById('bundle1Now');
    const b2Was = document.getElementById('bundle2Was');
    const b2Now = document.getElementById('bundle2Now');
    const b3Was = document.getElementById('bundle3Was');
    const b3Now = document.getElementById('bundle3Now');

    if (b1Now) b1Now.textContent = formatPrice(b1Price);
    if (b2Was) b2Was.textContent = formatPrice(unitPrice * 2);
    if (b2Now) b2Now.textContent = formatPrice(b2Price);
    if (b3Was) b3Was.textContent = formatPrice(unitPrice * 3);
    if (b3Now) b3Now.textContent = formatPrice(b3Price);
  }

  // Accordion Toggles
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  accordionTriggers.forEach(trig => {
    trig.addEventListener('click', () => {
      const parent = trig.closest('.accordion-item');
      parent.classList.toggle('open');
    });
  });

  // Add to Cart from Modal
  if (btnAddToCartLarge) {
    btnAddToCartLarge.addEventListener('click', () => {
      if (!state.selectedArtwork) return;

      const unitPrice = calculateItemUnitPrice(state.selectedArtwork, state.selectedSize, state.selectedFrame);
      let discountRate = 0;
      if (state.selectedBundle === 2) discountRate = 0.15;
      if (state.selectedBundle >= 3) discountRate = 0.20;

      const itemTotal = (unitPrice * state.selectedBundle) * (1 - discountRate);

      const cartItem = {
        id: `${state.selectedArtwork.id}-${state.selectedSize}-${state.selectedFrame}`,
        artworkId: state.selectedArtwork.id,
        title: state.selectedArtwork.title,
        sizeKey: state.selectedSize,
        sizeLabel: SIZE_CONFIG[state.selectedSize].label,
        frameKey: state.selectedFrame,
        frameLabel: FRAME_CONFIG[state.selectedFrame].label,
        quantity: state.selectedBundle,
        unitPrice: unitPrice * (1 - discountRate),
        image: state.selectedFrame === 'unframed' ? state.selectedArtwork.images.artwork : state.selectedArtwork.images.mockup
      };

      // Check if already in cart
      const existingIdx = state.cart.findIndex(i => i.id === cartItem.id);
      if (existingIdx > -1) {
        state.cart[existingIdx].quantity += cartItem.quantity;
      } else {
        state.cart.push(cartItem);
      }

      saveCart();
      closeProductModal();
      openCartDrawer();
      showToastNotification(`Added ${cartItem.quantity}× "${cartItem.title}" to your cart!`);
    });
  }

  if (btnExpressBuy) {
    btnExpressBuy.addEventListener('click', () => {
      btnAddToCartLarge.click();
      setTimeout(openCheckoutModal, 300);
    });
  }

  // =========================================================================
  // 4. CART DRAWER CONTROLLER
  // =========================================================================
  const cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
  const cartDrawerCloseBtn = document.getElementById('cartDrawerCloseBtn');
  const cartToggleBtns = document.querySelectorAll('.cart-btn');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotalVal = document.getElementById('cartSubtotalVal');
  const cartCountBadges = document.querySelectorAll('.cart-count');
  const shippingProgressBar = document.getElementById('shippingProgressBar');
  const shippingProgressText = document.getElementById('shippingProgressText');
  const btnCheckoutDrawer = document.getElementById('btnCheckoutDrawer');
  const btnApplyCoupon = document.getElementById('btnApplyCoupon');
  const couponInput = document.getElementById('couponInput');

  function openCartDrawer() {
    renderCartItems();
    cartDrawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    cartDrawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartToggleBtns.forEach(btn => btn.addEventListener('click', openCartDrawer));
  if (cartDrawerCloseBtn) cartDrawerCloseBtn.addEventListener('click', closeCartDrawer);
  if (cartDrawerBackdrop) {
    cartDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === cartDrawerBackdrop) closeCartDrawer();
    });
  }

  function saveCart() {
    localStorage.setItem('ian_arts_cart', JSON.stringify(state.cart));
    updateCartBadges();
  }

  function updateCartBadges() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadges.forEach(b => {
      b.textContent = totalCount;
      b.style.display = totalCount > 0 ? 'flex' : 'none';
    });
  }

  function renderCartItems() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    if (state.cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-message">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#BBB" stroke-width="1.5" style="margin: 0 auto 1rem;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <p>Your studio cart is currently empty.</p>
          <button class="btn-inspect" onclick="document.getElementById('cartDrawerCloseBtn').click(); location.href='#gallery';" style="margin-top: 1rem;">
            Explore Available Artworks →
          </button>
        </div>
      `;
      cartSubtotalVal.textContent = formatPrice(0);
      if (shippingProgressBar) shippingProgressBar.style.width = '0%';
      if (shippingProgressText) shippingProgressText.innerHTML = `Add <strong>${formatPrice(150)}</strong> more for <strong>FREE Insured Shipping</strong>`;
      return;
    }

    let subtotalUSD = 0;

    state.cart.forEach((item, index) => {
      const itemTotalUSD = item.unitPrice * item.quantity;
      subtotalUSD += itemTotalUSD;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img class="cart-item-img" src="${item.image}" alt="${item.title}" />
        <div class="cart-item-details">
          <div>
            <h4 class="cart-item-title">${item.title}</h4>
            <div class="cart-item-variants">${item.sizeLabel}</div>
            <div class="cart-item-variants">${item.frameLabel}</div>
          </div>
          <div class="cart-item-bottom">
            <div class="qty-control">
              <button class="qty-btn btn-qty-dec" data-index="${index}">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn btn-qty-inc" data-index="${index}">+</button>
            </div>
            <div class="cart-item-price">${formatPrice(itemTotalUSD)}</div>
          </div>
        </div>
      `;

      itemEl.querySelector('.btn-qty-dec').addEventListener('click', () => {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          state.cart.splice(index, 1);
        }
        saveCart();
        renderCartItems();
      });

      itemEl.querySelector('.btn-qty-inc').addEventListener('click', () => {
        item.quantity++;
        saveCart();
        renderCartItems();
      });

      cartItemsList.appendChild(itemEl);
    });

    // Apply Promo Discount
    const finalSubtotal = subtotalUSD * (1 - state.promoDiscount);
    cartSubtotalVal.textContent = formatPrice(finalSubtotal);

    // Free Shipping Progress (Threshold: $150 USD)
    const threshold = 150;
    const progressPct = Math.min(100, (subtotalUSD / threshold) * 100);
    if (shippingProgressBar) shippingProgressBar.style.width = `${progressPct}%`;

    if (shippingProgressText) {
      if (subtotalUSD >= threshold) {
        shippingProgressText.innerHTML = `🎉 You have unlocked <strong>FREE Worldwide Insured Shipping!</strong>`;
      } else {
        const remaining = threshold - subtotalUSD;
        shippingProgressText.innerHTML = `Add <strong>${formatPrice(remaining)}</strong> more for <strong>FREE Insured Shipping</strong>`;
      }
    }
  }

  // Coupon code handler
  if (btnApplyCoupon && couponInput) {
    btnApplyCoupon.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === 'IAN10' || code === 'STUDIO10') {
        state.promoDiscount = 0.10;
        showToastNotification('Code "IAN10" applied! 10% Studio VIP Discount added.');
        renderCartItems();
      } else if (code === 'FREESHIP') {
        showToastNotification('Free Worldwide Express Shipping applied!');
      } else {
        showToastNotification('Invalid discount code. Try "IAN10"');
      }
    });
  }

  // =========================================================================
  // 5. CHECKOUT MODAL CONTROLLER
  // =========================================================================
  const checkoutModalBackdrop = document.getElementById('checkoutModalBackdrop');
  const btnCloseCheckout = document.getElementById('btnCloseCheckout');
  const checkoutItemsSummary = document.getElementById('checkoutItemsSummary');
  const checkoutSubtotal = document.getElementById('checkoutSubtotal');
  const checkoutShipping = document.getElementById('checkoutShipping');
  const checkoutTotal = document.getElementById('checkoutTotal');
  const checkoutForm = document.getElementById('checkoutForm');

  function openCheckoutModal() {
    if (state.cart.length === 0) {
      showToastNotification('Your cart is empty.');
      return;
    }
    closeCartDrawer();

    const rawSubtotal = state.cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const discounted = rawSubtotal * (1 - state.promoDiscount);
    const shipping = discounted >= 150 ? 0 : 25;
    const total = discounted + shipping;

    checkoutSubtotal.textContent = formatPrice(discounted);
    checkoutShipping.textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
    checkoutTotal.textContent = formatPrice(total);

    checkoutItemsSummary.innerHTML = state.cart.map(i => `
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.4rem;">
        <span>${i.quantity}× ${i.title} (${i.sizeKey})</span>
        <strong>${formatPrice(i.unitPrice * i.quantity)}</strong>
      </div>
    `).join('');

    checkoutModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckoutModal() {
    checkoutModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnCheckoutDrawer) btnCheckoutDrawer.addEventListener('click', openCheckoutModal);
  if (btnCloseCheckout) btnCloseCheckout.addEventListener('click', closeCheckoutModal);

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const orderNumber = 'IA-' + Math.floor(100000 + Math.random() * 900000);
      
      // Order Complete UI
      const modalInner = document.getElementById('checkoutModalContent');
      modalInner.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: #E8F5E9; color: #1B8755; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2rem;">✓</div>
          <h2 style="font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Thank You for Your Collector Order</h2>
          <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
            Order <strong>#${orderNumber}</strong> has been registered with Studio Kimemia.
            An insured delivery tracking number and digital Certificate of Authenticity have been sent to your email.
          </p>
          <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 4px; border: 1px solid var(--border-light); max-width: 450px; margin: 0 auto 2rem; text-align: left;">
            <p style="font-size: 0.85rem; margin-bottom: 0.5rem;"><strong>Artist:</strong> Ian Kimemia (@ian._arts)</p>
            <p style="font-size: 0.85rem; margin-bottom: 0.5rem;"><strong>Status:</strong> Preparing for Museum Archival Packaging</p>
            <p style="font-size: 0.85rem; margin-bottom: 0.5rem;"><strong>Carrier:</strong> DHL Express Insured Art Freight</p>
          </div>
          <button class="btn-inspect" onclick="location.reload();" style="padding: 12px 28px; background: var(--text-primary); color: #FFF;">
            Return to Gallery
          </button>
        </div>
      `;

      state.cart = [];
      saveCart();
    });
  }

  // =========================================================================
  // 6. LOOX-STYLE SOCIAL PROOF FLOATING TOAST (Matching Screenshot 3)
  // =========================================================================
  const looxToast = document.getElementById('looxToast');
  const toastImg = document.getElementById('toastImg');
  const toastReviewer = document.getElementById('toastReviewer');
  const toastQuote = document.getElementById('toastQuote');
  const toastArtTitle = document.getElementById('toastArtTitle');
  const toastClose = document.getElementById('toastClose');

  let currentReviewIdx = 0;
  function triggerSocialProofToast() {
    if (!looxToast) return;
    const rev = REVIEWS[currentReviewIdx];
    const art = ARTWORKS.find(a => a.id === rev.artworkId) || ARTWORKS[0];

    toastImg.src = rev.photo || art.images.mockup;
    toastReviewer.textContent = `${rev.name} (${rev.location})`;
    toastQuote.textContent = `"${rev.comment.substring(0, 75)}..."`;
    toastArtTitle.textContent = `${art.title} • Verified Collector`;

    looxToast.classList.add('show');

    setTimeout(() => {
      looxToast.classList.remove('show');
    }, 5500);

    currentReviewIdx = (currentReviewIdx + 1) % REVIEWS.length;
  }

  // Run toast every 10 seconds
  setTimeout(() => {
    triggerSocialProofToast();
    setInterval(triggerSocialProofToast, 11000);
  }, 3500);

  if (toastClose) {
    toastClose.addEventListener('click', (e) => {
      e.stopPropagation();
      looxToast.classList.remove('show');
    });
  }

  if (looxToast) {
    looxToast.addEventListener('click', () => {
      const rev = REVIEWS[(currentReviewIdx - 1 + REVIEWS.length) % REVIEWS.length];
      openProductModal(rev.artworkId);
    });
  }

  // =========================================================================
  // 7. INSTAGRAM BIO MODAL / LINKS
  // =========================================================================
  const bioModalBackdrop = document.getElementById('bioModalBackdrop');
  const bioModalCloseBtn = document.getElementById('bioModalCloseBtn');
  const bioLinkBtns = document.querySelectorAll('.trigger-bio-modal');

  function openBioModal() {
    bioModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBioModal() {
    bioModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  bioLinkBtns.forEach(btn => btn.addEventListener('click', openBioModal));
  if (bioModalCloseBtn) bioModalCloseBtn.addEventListener('click', closeBioModal);
  if (bioModalBackdrop) {
    bioModalBackdrop.addEventListener('click', (e) => {
      if (e.target === bioModalBackdrop) closeBioModal();
    });
  }

  // =========================================================================
  // 8. COMMISSIONS FORM HANDLER
  // =========================================================================
  const commissionForm = document.getElementById('commissionForm');
  if (commissionForm) {
    commissionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToastNotification('Thank you! Ian will personally review your commission request and reply within 24 hours.');
      commissionForm.reset();
    });
  }

  // Newsletter Form Handler
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToastNotification('Welcome to Studio Kimemia VIP! Use code "IAN10" for 10% off your first collector order.');
      newsletterForm.reset();
    });
  }

  // General Toast Notification Helper
  function showToastNotification(message) {
    let toast = document.getElementById('genericToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'genericToast';
      toast.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        background: #111;
        color: #FFF;
        padding: 14px 22px;
        border-radius: 4px;
        box-shadow: var(--shadow-xl);
        font-size: 0.88rem;
        z-index: 2000;
        border-left: 4px solid var(--accent-gold);
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
    }, 4000);
  }

  // Mobile Navigation Drawer Toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');

  if (mobileMenuToggle && mobileNavDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileNavDrawer.classList.add('active');
    });
  }
  if (mobileDrawerClose && mobileNavDrawer) {
    mobileDrawerClose.addEventListener('click', () => {
      mobileNavDrawer.classList.remove('active');
    });
  }

  // Scroll Header Shadow
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }
  });

  // Initialize
  renderShiftingTrack();
  renderArtworkGrid();
  updateCartBadges();
});

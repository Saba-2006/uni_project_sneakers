/* ══════════════════════════════════════════════════════════
       CONFIG — Product Images (replace with your own URLs)
    ══════════════════════════════════════════════════════════ */
const images = [
  {
    full: "./imgs/product_001.jpg",
    thumb:
      "./imgs/product_001.jpg",
  },
  {
    full: "./imgs/product_002.jpg",
    thumb:
      "./imgs/product_002.jpg",
  },
  {
    full: "./imgs/product_003.jpg",
    thumb:
      "./imgs/product_003.jpg",
  },
  {
    full: "./imgs/product_004.jpg",
    thumb:
      "./imgs/product_004.jpg",
  },
];

/* ══════════════════════════════════════════════════════════
       STATE
    ══════════════════════════════════════════════════════════ */
let currentImg = 0;
let qty = 0;
let cartQty = 0;
let cartOpen = false;
let navOpen = false;
let lightboxOpen = false;
let lightboxImg = 0;

/* ══════════════════════════════════════════════════════════
       DOM ELEMENTS
    ══════════════════════════════════════════════════════════ */
const overlay = document.getElementById("overlay");
const burgerBtn = document.getElementById("burgerBtn");
const navLinks = document.getElementById("navLinks");
const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartBadge = document.getElementById("cartBadge");
const cartEmpty = document.getElementById("cartEmpty");
const cartItemContainer = document.getElementById("cartItemContainer");
const checkoutBtn = document.getElementById("checkoutBtn");
const mainImage = document.getElementById("mainImage");
const galleryThumbs = document.getElementById("galleryThumbs");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");
const qtyMinus = document.getElementById("qtyMinus");
const qtyPlus = document.getElementById("qtyPlus");
const qtyValue = document.getElementById("qtyValue");
const addToCartBtn = document.getElementById("addToCartBtn");
const lightbox = document.getElementById("lightbox");
const lightboxBackdrop = document.getElementById("lightboxBackdrop");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxMainImg = document.getElementById("lightboxMainImg");
const lightboxThumbs = document.getElementById("lightboxThumbs");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

/* ══════════════════════════════════════════════════════════
       UTILITIES
    ══════════════════════════════════════════════════════════ */
function preloadImages() {
  images.forEach((img) => {
    const imgEl = new Image();
    imgEl.src = img.full;
  });
}

function setGalleryImage(index) {
  currentImg = ((index % images.length) + images.length) % images.length;
  mainImage.classList.add("fade");
  const tempImg = new Image();
  tempImg.onload = () => {
    mainImage.src = images[currentImg].full;
    mainImage.classList.remove("fade");
  };
  tempImg.onerror = () => {
    mainImage.classList.remove("fade");
  };
  tempImg.src = images[currentImg].full;

  document.querySelectorAll(".thumb-btn").forEach((btn, i) => {
    btn.classList.toggle("active", i === currentImg);
  });
}

function buildGalleryThumbs() {
  galleryThumbs.innerHTML = "";
  images.forEach((img, i) => {
    const btn = document.createElement("button");
    btn.className = "thumb-btn" + (i === currentImg ? " active" : "");
    btn.setAttribute("aria-label", `View image ${i + 1}`);
    btn.innerHTML = `<img src="${img.thumb}" alt="Sneaker view ${i + 1}" loading="lazy">`;
    btn.addEventListener("click", () => setGalleryImage(i));
    galleryThumbs.appendChild(btn);
  });
}

function setLightboxImage(index) {
  lightboxImg = ((index % images.length) + images.length) % images.length;
  lightboxMainImg.src = images[lightboxImg].full;
  document.querySelectorAll(".lightbox-thumb-btn").forEach((btn, i) => {
    btn.classList.toggle("active", i === lightboxImg);
  });
}

function buildLightboxThumbs() {
  lightboxThumbs.innerHTML = "";
  images.forEach((img, i) => {
    const btn = document.createElement("button");
    btn.className = "lightbox-thumb-btn" + (i === lightboxImg ? " active" : "");
    btn.setAttribute("aria-label", `View image ${i + 1}`);
    btn.innerHTML = `<img src="${img.thumb}" alt="Sneaker view ${i + 1}" loading="lazy">`;
    btn.addEventListener("click", () => setLightboxImage(i));
    lightboxThumbs.appendChild(btn);
  });
}

function openLightbox() {
  if (window.innerWidth < 900) return;
  lightboxImg = currentImg;
  lightboxMainImg.src = images[lightboxImg].full;
  buildLightboxThumbs();
  lightbox.classList.add("open");
  lightboxOpen = true;
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightboxOpen = false;
  document.body.style.overflow = "";
}

/* ══════════════════════════════════════════════════════════
       CART
    ══════════════════════════════════════════════════════════ */
function updateCartUI() {
  if (cartQty === 0) {
    cartEmpty.style.display = "flex";
    cartItemContainer.innerHTML = "";
    checkoutBtn.style.display = "none";
    cartBadge.classList.remove("visible");
  } else {
    cartEmpty.style.display = "none";
    checkoutBtn.style.display = "block";
    cartBadge.classList.add("visible");
    cartBadge.textContent = cartQty > 99 ? "99+" : cartQty;

    const total = (125 * cartQty).toFixed(2);
    cartItemContainer.innerHTML = `
          <div class="cart-item">
            <img class="cart-item-img" src="${images[0].thumb}" alt="Fall Limited Edition Sneakers" loading="lazy">
            <div class="cart-item-info">
              <p class="cart-item-name">Fall Limited Edition Sneakers</p>
              <p class="cart-item-price">$125.00 × ${cartQty}<span class="cart-item-total"> $${total}</span></p>
            </div>
            <button class="cart-delete-btn" id="deleteCartItem" aria-label="Remove item from cart">
              <svg viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5L4.84.388A.875.875 0 0 1 5.573 0h2.855c.284 0 .554.13.733.388L9.75 1h3.5c.416 0 .75.334.75.75v.875a.375.375 0 0 1-.375.375H.375A.375.375 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7Zm3 0a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7Zm3 0a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        `;
    document.getElementById("deleteCartItem").addEventListener("click", () => {
      cartQty = 0;
      updateCartUI();
    });
  }
}

function toggleCart(show) {
  cartOpen = show !== undefined ? show : !cartOpen;
  cartDrawer.classList.toggle("open", cartOpen);
  cartBtn.setAttribute("aria-expanded", cartOpen);
}

/* ══════════════════════════════════════════════════════════
       QUANTITY
    ══════════════════════════════════════════════════════════ */
function updateQty(newQty) {
  qty = Math.max(0, newQty);
  qtyValue.textContent = qty;
  addToCartBtn.disabled = qty === 0;
}

/* ══════════════════════════════════════════════════════════
       NAV
    ══════════════════════════════════════════════════════════ */
function toggleNav(show) {
  navOpen = show !== undefined ? show : !navOpen;
  burgerBtn.classList.toggle("open", navOpen);
  burgerBtn.setAttribute("aria-expanded", navOpen);
  navLinks.classList.toggle("open", navOpen);
  overlay.classList.toggle("active", navOpen);
  document.body.style.overflow = navOpen ? "hidden" : "";
}

function closeNav() {
  toggleNav(false);
}

/* ══════════════════════════════════════════════════════════
       EVENT LISTENERS
    ══════════════════════════════════════════════════════════ */
galleryPrev.addEventListener("click", () => setGalleryImage(currentImg - 1));
galleryNext.addEventListener("click", () => setGalleryImage(currentImg + 1));
mainImage.addEventListener("click", openLightbox);

lightboxClose.addEventListener("click", closeLightbox);
lightboxBackdrop.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => setLightboxImage(lightboxImg - 1));
lightboxNext.addEventListener("click", () => setLightboxImage(lightboxImg + 1));

qtyMinus.addEventListener("click", () => updateQty(qty - 1));
qtyPlus.addEventListener("click", () => updateQty(qty + 1));

addToCartBtn.addEventListener("click", () => {
  if (qty === 0) return;
  cartQty += qty;
  updateQty(0);
  updateCartUI();
  if (!cartOpen) toggleCart(true);
});

cartBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleCart();
});

document.addEventListener("click", (e) => {
  if (
    cartOpen &&
    !cartDrawer.contains(e.target) &&
    !cartBtn.contains(e.target)
  ) {
    toggleCart(false);
  }
});

burgerBtn.addEventListener("click", () => toggleNav());
overlay.addEventListener("click", () => {
  if (navOpen) closeNav();
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (navOpen) closeNav();
  });
});

document.addEventListener("keydown", (e) => {
  if (!lightboxOpen) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") setLightboxImage(lightboxImg - 1);
  if (e.key === "ArrowRight") setLightboxImage(lightboxImg + 1);
});

/* ══════════════════════════════════════════════════════════
       INIT
    ══════════════════════════════════════════════════════════ */
mainImage.src = images[0].full;
buildGalleryThumbs();
preloadImages();
updateQty(0);

let slides = document.querySelectorAll(".slide");
let index = 0;

// ------------ HAMBURGER MENU --------------
// ------ MOBILE MENU (slide-in overlay) ----------
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu   = document.getElementById('mobileMenu');
const menuOverlay  = document.getElementById('menuOverlay');
const menuClose    = document.getElementById('menuClose');

function openMenu() {
  mobileMenu.classList.add('open');
  menuOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  menuOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburgerBtn.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);




(function () {
  const track    = document.querySelector('.diamond-track');
  const prevBtn  = document.querySelector('.diamond-prev');
  const nextBtn  = document.querySelector('.diamond-next');
  const dotsWrap = document.querySelector('.diamond-dots');
  if (!track) return;

  // ── Clone cards for infinite loop ──
  const originalCards = Array.from(track.children);
  const total = originalCards.length;

  // Clone all cards and append + prepend
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.prepend(clone);
  });

  const allCards = Array.from(track.children);

  function getCardWidth() {
    return allCards[0]
      ? Math.round(allCards[0].getBoundingClientRect().width + 16)
      : 216;
  }

  // Start at the first real card (after the prepended clones)
  let currentIndex = total; 
  let isTransitioning = false;

  function goTo(index, animate = true) {
    if (!animate) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 600ms ease';
    }
    track.style.transform = `translateX(${-index * getCardWidth()}px)`;
    currentIndex = index;
  }

  // Set initial position instantly
  goTo(currentIndex, false);

  // After transition ends, silently jump for infinite loop
  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (currentIndex >= total * 2) {
      goTo(total, false);
    } else if (currentIndex < total) {
      goTo(total * 2 - 1, false);
    }
    updateDots();
  });

  function advance(dir = 1) {
    if (isTransitioning) return;
    isTransitioning = true;
    goTo(currentIndex + dir);
  }

  // ── Dots (only for original cards) ──
  originalCards.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.addEventListener('click', () => {
      const target = total + i;
      isTransitioning = true;
      goTo(target);
    });
    dotsWrap.appendChild(btn);
  });

  function updateDots() {
    const realIndex = ((currentIndex - total) % total + total) % total;
    Array.from(dotsWrap.children).forEach((btn, i) => {
      btn.classList.toggle('active', i === realIndex);
    });
  }


  
  updateDots();

  // ── Arrow buttons ──
  nextBtn.addEventListener('click', () => advance(1));
  prevBtn.addEventListener('click', () => advance(-1));

  
  let autoTimer = setInterval(() => advance(1), 2500);

  const sliderEl = document.querySelector('.diamond-slider');
  sliderEl.addEventListener('mouseenter', () => clearInterval(autoTimer));
  sliderEl.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => advance(1), 2500);
  });

 
  window.addEventListener('resize', () => goTo(currentIndex, false));
})();








function showSlide() {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[index].classList.add("active");

    index++;
    if (index === slides.length) index = 0;
}

setInterval(showSlide, 4000);


// -------- HERO RING CAROUSEL -----
(function () {
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const title  = document.getElementById('hero-title');
  const price  = document.getElementById('hero-price');
  if (!slides.length) return;

  const data = [
    { name: "Hidden Halo", price: "$3500" },
    { name: "Vintage & Antique", price: "$4500" },
    { name: "Pave", price: "$2500" },
  ];

  // positions cycle: left=0, center=1, right=2
  const POSITIONS = ['pos-left', 'pos-center', 'pos-right'];
  let centerIndex = 1; 

  function getPos(slideIndex) {
    
    const total = slides.length;
    const diff = ((slideIndex - centerIndex) % total + total) % total;
    if (diff === 0) return 'pos-center';
    if (diff === 1) return 'pos-right';
    return 'pos-left';
  }

  function updateCarousel() {
  slides.forEach((slide, i) => {
    slide.classList.remove('pos-left', 'pos-center', 'pos-right');
    slide.classList.add(getPos(i));
  });

  // ── UPDATE background text with ring name ──
  const bgText = document.querySelector('.bg-text');
  if (bgText) {
    bgText.style.opacity = '0';
    setTimeout(() => {
      bgText.textContent = data[centerIndex].name;
      bgText.style.opacity = '1';
    }, 300);
  }

  // Fade hero-content info out then in
  if (title) {
    title.style.opacity = '0';
    price.style.opacity = '0';
    setTimeout(() => {
      title.textContent = data[centerIndex].name;
      price.textContent = data[centerIndex].price;
      title.style.opacity = '1';
      price.style.opacity = '1';
    }, 300);
  }
}

  function advance() {
    centerIndex = (centerIndex + 1) % slides.length;
    updateCarousel();
  }

  // Initial render
  updateCarousel();

  // Auto-rotate every 3 seconds
  let timer = setInterval(advance, 3000);

  // Click left/right cards to navigate
  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      if (slide.classList.contains('pos-left') || slide.classList.contains('pos-right')) {
        centerIndex = i;
        updateCarousel();
        clearInterval(timer);
        timer = setInterval(advance, 3000);
      }
    });
  });
})();


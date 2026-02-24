let slides = document.querySelectorAll(".slide");
let index = 0;

// ================= HAMBURGER MENU =================
// ===== MOBILE MENU (slide-in overlay) =====
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




// ===== COVERFLOW DIAMOND SLIDER =====
// ===== COVERFLOW DIAMOND SLIDER — INFINITE LOOP =====
// ===== CONVEYOR BELT DIAMOND SLIDER =====
(function () {
  const diamonds = [
    { name: "Round",   sub: "Every diamond in our collection", img: "images/Round.webp" },
    { name: "Emerald", sub: "Every diamond in our collection", img: "images/Emerald.webp" },
    { name: "Round",   sub: "Every diamond in our collection", img: "images/Round.webp" },
    { name: "Oval",    sub: "Every diamond in our collection", img: "images/Oval.webp" },
    { name: "Heart",   sub: "Every diamond in our collection", img: "images/Heart.webp" },
    { name: "Asscher", sub: "Every diamond in our collection", img: "images/Asscher.webp" },
    { name: "Heart",   sub: "Every diamond in our collection", img: "images/Heart.webp" },
  ];

  const stage   = document.getElementById('cfStage');
  const dotsEl  = document.getElementById('cfDots');
  const prevBtn = document.getElementById('cfPrev');
  const nextBtn = document.getElementById('cfNext');
  if (!stage) return;

  const total  = diamonds.length;
  let order    = diamonds.map((_, i) => i);
  const CENTER = Math.floor(total / 2);
  let isAnimating = false;

  const cards = order.map(() => {
    const card = document.createElement('div');
    card.className = 'cf-card';
    card.innerHTML = `
      <img src="" alt=""/>
      <div class="cf-title"></div>
      <div class="cf-sub"></div>
    `;
    stage.appendChild(card);
    return card;
  });

  diamonds.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'cf-dot';
    dot.addEventListener('click', () => goToData(i));
    dotsEl.appendChild(dot);
  });

  function getGap() {
    if (window.innerWidth <= 480) return 90;
    if (window.innerWidth <= 768) return 110;
    return 150;
  }

  function updateContent() {
    order.forEach((dataIdx, slotIdx) => {
      const d    = diamonds[dataIdx];
      const card = cards[slotIdx];
      card.querySelector('img').src = d.img;
      card.querySelector('img').alt = d.name;
      card.querySelector('.cf-title').textContent = d.name;
      card.querySelector('.cf-sub').textContent   = d.sub;
    });
  }

  function render(animate) {
    const gap = getGap();
    cards.forEach((card, slotIdx) => {
      const offset    = slotIdx - CENTER;
      const absOffset = Math.abs(offset);
      const sign      = Math.sign(offset);
      const tx        = offset * gap;
      const ry        = -sign * Math.min(absOffset * 10, 20);
      const tz        = -absOffset * 20;
      const scale     = absOffset === 0 ? 1.05 : Math.max(0.88, 1 - absOffset * 0.06);
      const zIdx      = absOffset === 0 ? 100 : total - absOffset;

      card.style.transition = animate
        ? 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.65s ease, box-shadow 0.65s ease'
        : 'none';
      card.style.transform = `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`;
      card.style.opacity   = '1';
      card.style.zIndex    = zIdx;
      card.classList.toggle('active', slotIdx === CENTER);
    });

    const activeDotIdx = order[CENTER];
    dotsEl.querySelectorAll('.cf-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === activeDotIdx);
    });
  }

  function goNext() {
    if (isAnimating) return;
    isAnimating = true;
    const gap = getGap();

    // Exit leftmost card to the left behind
    const exitCard = cards[0];
    exitCard.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease';
    exitCard.style.transform  = `translateX(${-(CENTER + 1) * gap * 1.5}px) translateZ(-200px) scale(0.4)`;
    exitCard.style.opacity    = '0';

    // Slide remaining cards left
    for (let i = 1; i < total; i++) {
      const offset    = (i - 1) - CENTER;
      const absOffset = Math.abs(offset);
      const sign      = Math.sign(offset);
      const tx        = offset * gap;
      const ry        = -sign * Math.min(absOffset * 10, 20);
      const tz        = -absOffset * 20;
      const scale     = absOffset === 0 ? 1.05 : Math.max(0.88, 1 - absOffset * 0.06);
      const zIdx      = absOffset === 0 ? 100 : total - absOffset;

      cards[i].style.transition = 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.65s ease';
      cards[i].style.transform  = `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`;
      cards[i].style.zIndex     = zIdx;
      cards[i].classList.toggle('active', (i - 1) === CENTER);
    }

    setTimeout(() => {
      // Rotate order: first becomes last
      const first = order.shift();
      order.push(first);

      // Teleport exit card to rightmost position silently
      exitCard.style.transition = 'none';
      const ro    = CENTER;
      exitCard.style.transform  = `translateX(${ro * gap}px) translateZ(${-ro * 20}px) rotateY(${-Math.min(ro * 10, 20)}deg) scale(${Math.max(0.88, 1 - ro * 0.06)})`;
      exitCard.style.opacity    = '0';
      exitCard.style.zIndex     = total - ro;

      // Move first card element to end of array
      cards.push(cards.shift());

      updateContent();
      stage.getBoundingClientRect(); // force repaint

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          cards[total - 1].style.transition = 'opacity 0.4s ease';
          cards[total - 1].style.opacity    = '1';
          isAnimating = false;
          syncDots();
        });
      });
    }, 680);
  }

  function goPrev() {
    if (isAnimating) return;
    isAnimating = true;
    const gap = getGap();

    // Exit rightmost card to the right behind
    const exitCard = cards[total - 1];
    exitCard.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease';
    exitCard.style.transform  = `translateX(${(CENTER + 1) * gap * 1.5}px) translateZ(-200px) scale(0.4)`;
    exitCard.style.opacity    = '0';

    // Slide remaining cards right
    for (let i = 0; i < total - 1; i++) {
      const offset    = (i + 1) - CENTER;
      const absOffset = Math.abs(offset);
      const sign      = Math.sign(offset);
      const tx        = offset * gap;
      const ry        = -sign * Math.min(absOffset * 10, 20);
      const tz        = -absOffset * 20;
      const scale     = absOffset === 0 ? 1.05 : Math.max(0.88, 1 - absOffset * 0.06);
      const zIdx      = absOffset === 0 ? 100 : total - absOffset;

      cards[i].style.transition = 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.65s ease';
      cards[i].style.transform  = `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`;
      cards[i].style.zIndex     = zIdx;
      cards[i].classList.toggle('active', (i + 1) === CENTER);
    }

    setTimeout(() => {
      // Rotate order: last becomes first
      const last = order.pop();
      order.unshift(last);

      // Teleport exit card to leftmost position silently
      exitCard.style.transition = 'none';
      const lo    = CENTER;
      exitCard.style.transform  = `translateX(${-lo * gap}px) translateZ(${-lo * 20}px) rotateY(${Math.min(lo * 10, 20)}deg) scale(${Math.max(0.88, 1 - lo * 0.06)})`;
      exitCard.style.opacity    = '0';
      exitCard.style.zIndex     = total - lo;

      // Move last card element to front of array
      cards.unshift(cards.pop());

      updateContent();
      stage.getBoundingClientRect(); // force repaint

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          cards[0].style.transition = 'opacity 0.4s ease';
          cards[0].style.opacity    = '1';
          isAnimating = false;
          syncDots();
        });
      });
    }, 680);
  }

  function syncDots() {
    const activeDotIdx = order[CENTER];
    dotsEl.querySelectorAll('.cf-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === activeDotIdx);
    });
  }

  function goToData(targetDataIdx) {
    const currentDataIdx = order[CENTER];
    if (targetDataIdx === currentDataIdx) return;
    let diff = targetDataIdx - currentDataIdx;
    if (diff > total / 2)  diff -= total;
    if (diff < -total / 2) diff += total;
    let steps = Math.abs(diff);
    const dir = diff > 0 ? goNext : goPrev;
    function step() {
      if (steps <= 0) return;
      dir();
      steps--;
      if (steps > 0) setTimeout(step, 720);
    }
    step();
  }

  prevBtn.addEventListener('click', () => { if (!isAnimating) goPrev(); });
  nextBtn.addEventListener('click', () => { if (!isAnimating) goNext(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { if (!isAnimating) goPrev(); }
    if (e.key === 'ArrowRight') { if (!isAnimating) goNext(); }
  });

  let touchX = 0;
  stage.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) { dx < 0 ? goNext() : goPrev(); }
  });

  let autoTimer = setInterval(() => { if (!isAnimating) goNext(); }, 2500);
  stage.addEventListener('mouseenter', () => clearInterval(autoTimer));
  stage.addEventListener('mouseleave', () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => { if (!isAnimating) goNext(); }, 2500);
  });

  window.addEventListener('resize', () => render(false));

  updateContent();
  render(false);
})();








function showSlide() {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[index].classList.add("active");

    index++;
    if (index === slides.length) index = 0;
}

setInterval(showSlide, 4000);


// ===== HERO RING CAROUSEL =====
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
  let centerIndex = 1; // which slide is currently center

  function getPos(slideIndex) {
    // relative position from center
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


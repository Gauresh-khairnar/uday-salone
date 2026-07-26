/* ============================================
   UDAY BEAUTY SALON & ACADEMY - GLOBAL SCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile Viewport Height Fix (address bar issue) ---- */
  function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  setVH();
  window.addEventListener('resize', setVH, { passive: true });


  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ---- Mobile Hamburger Menu ---- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Active Nav Link Highlight ---- */
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Hero Parallax ---- */
  const parallaxBg = document.querySelector('.hero-parallax-bg');
  if (parallaxBg) {
    window.addEventListener('scroll', () => {
      parallaxBg.style.transform = `scale(1.1) translateY(${window.scrollY * 0.25}px)`;
    }, { passive: true });
  }

  /* ---- Before & After Slider ---- */
  initBeforeAfterSlider();

  /* ---- Scroll Reveal ---- */
  initScrollReveal();

  /* ---- Services Page Tabs ---- */
  initServicesTabs();

});

/* ========================================================
   SERVICES PAGE TABS
   Active tab switching for Salon, Beauty, and Makeup sections.
======================================================== */
function initServicesTabs() {
  const tabs = document.querySelectorAll('.services-tabs .tab-btn');
  const contents = document.querySelectorAll('.services-tab-content');
  if (!tabs.length || !contents.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetContent = document.getElementById(target);
      if (targetContent) {
        targetContent.classList.add('active');
        
        // Ensure scroll reveal animations are triggered for elements inside active tab
        const revealItems = targetContent.querySelectorAll('.reveal');
        revealItems.forEach(item => {
          item.classList.add('visible');
        });
      }
    });
  });
}

/* ========================================================
   BEFORE & AFTER SLIDER
   Touch-friendly, drag-based image comparison.
======================================================== */
function initBeforeAfterSlider() {
  const slider    = document.getElementById('comparisionSlider');
  if (!slider) return;

  const afterImg  = slider.querySelector('.slider-after');
  const line      = slider.querySelector('.slider-overlay-line');
  const handle    = slider.querySelector('.slider-handle');
  let isDragging  = false;

  function setPosition(x) {
    const rect    = slider.getBoundingClientRect();
    let   percent = ((x - rect.left) / rect.width) * 100;
    percent       = Math.min(Math.max(percent, 1), 99);

    afterImg.style.clipPath  = `inset(0 ${100 - percent}% 0 0)`;
    line.style.left          = `${percent}%`;
    handle.style.left        = `${percent}%`;
  }

  /* Mouse */
  slider.addEventListener('mousedown', e => { isDragging = true; setPosition(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', e => { if (isDragging) setPosition(e.clientX); });
  window.addEventListener('mouseup',   () => { isDragging = false; });

  /* Touch */
  slider.addEventListener('touchstart', e => { isDragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove',  e => { if (isDragging) setPosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend',   () => { isDragging = false; });
}

/* ========================================================
   SCROLL REVEAL
   Animate elements as they enter the viewport.
======================================================== */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(item => observer.observe(item));
}

/* ========================================================
   MUSIC TOGGLE PLAYER
   Auto-injects a floating music button on every page.
   Place your music file at: audio/bg-music.mp3
======================================================== */
(function initMusicPlayer() {
  const waveHTML = `
    <div class="music-waves" id="musicWaves">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    <button class="music-toggle" id="musicToggle" aria-label="Toggle background music" title="Play / Pause Music">
      <svg class="music-icon-play" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5v14l11-7z"/>
      </svg>
      <svg class="music-icon-pause" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
      </svg>
    </button>
    <span class="music-tooltip" id="musicTooltip">&#9835; Background Music</span>
    <audio id="bgMusic" loop preload="none">
      <source src="audio/bg-music.mp3" type="audio/mpeg" />
    </audio>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = waveHTML;
  while (wrapper.firstChild) document.body.appendChild(wrapper.firstChild);

  const btn    = document.getElementById('musicToggle');
  const audio  = document.getElementById('bgMusic');
  const waves  = document.getElementById('musicWaves');
  const tip    = document.getElementById('musicTooltip');

  if (!btn || !audio) return;

  let isPlaying = sessionStorage.getItem('musicPlaying') === 'true';
  if (isPlaying) {
    audio.volume = 0.35;
    const playAttempt = audio.play();
    if (playAttempt) {
      playAttempt.then(() => setPlaying(true)).catch(() => {
        isPlaying = false;
        setPlaying(false);
      });
    }
  }

  btn.addEventListener('click', function () {
    if (audio.paused) {
      audio.volume = 0.35;
      audio.play().then(() => {
        setPlaying(true);
        sessionStorage.setItem('musicPlaying', 'true');
      }).catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
      sessionStorage.setItem('musicPlaying', 'false');
    }
  });

  function setPlaying(state) {
    if (state) {
      btn.classList.add('playing');
      waves.classList.add('active');
      if (tip) tip.textContent = '\u266B Now Playing';
    } else {
      btn.classList.remove('playing');
      waves.classList.remove('active');
      if (tip) tip.textContent = '\u266B Background Music';
    }
  }
})();

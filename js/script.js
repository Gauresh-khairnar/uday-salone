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

  /* ---- Hero Slideshow ---- */
  initHeroSlideshow();

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

    afterImg.style.clipPath  = `inset(0 0 0 ${percent}%)`;
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
   HERO SLIDESHOW
   Changes hero image every 5 seconds with fade effect.
======================================================== */
function setupFadingSlideshow(imgElement, imagesArray, bgElement) {
  if (!imgElement || !imagesArray || imagesArray.length === 0) return;
  
  let currentIndex = 0;
  imgElement.style.transition = 'opacity 0.5s ease-in-out';
  if (bgElement) bgElement.style.transition = 'opacity 0.5s ease-in-out';

  let nextImage = new Image();
  nextImage.src = imagesArray[(currentIndex + 1) % imagesArray.length];

  setInterval(() => {
    imgElement.style.opacity = '0';
    if (bgElement) bgElement.style.opacity = '0';
    
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % imagesArray.length;
      imgElement.src = imagesArray[currentIndex];
      imgElement.style.opacity = '1';
      
      if (bgElement) {
        bgElement.style.backgroundImage = `url('${imagesArray[currentIndex]}')`;
        bgElement.style.opacity = '0.15';
      }
      
      nextImage = new Image();
      nextImage.src = imagesArray[(currentIndex + 1) % imagesArray.length];
    }, 500);
  }, 5000);
}

function initHeroSlideshow() {
  const heroImage = document.getElementById('heroImage');
  const heroBg = document.querySelector('.hero-parallax-bg');
  
  const heroImages = [
    'Images/IMG_20241006_100659.jpg',
    'Images/IMG_20250807_075322.jpg',
    'Images/InShot_20240809_105002938.jpg',
    'Images/IMG_20240620_201923_561.jpg',
    'Images/IMG_20240620_201923_615.jpg',
    'Images/mayuri_bride_3.jpg',
    'Images/mayuri_bride_7.jpg',
    'Images/mayuri_bride_2.jpg',
    'Images/mayuri_bride_1.jpg'
  ];
  
  setupFadingSlideshow(heroImage, heroImages, heroBg);
  
  const academyImage = document.getElementById('academyImage');
  const academyImages = [
    'Images/IMG-20240619-WA0033.jpg',
    'Images/IMG_20240621_195456_523.jpg',
    'Images/IMG_20250807_075635.jpg',
    'Images/mayuri_bride_3.jpg',
    'Images/mayuri_bride_1.jpg'
  ];
  
  setupFadingSlideshow(academyImage, academyImages, null);
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

/* ========================================================
   ANIMATED COUNTERS (TRUST SECTION)
======================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const statNumbers = document.querySelectorAll('.badge-num, .stat-num');
  
  if (!statNumbers.length) return;

  const animateValue = (obj, start, end, duration, suffix = '') => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      let currentVal = Math.floor(easeOutQuart * (end - start) + start);
      
      // Keep decimals if present in original text
      if (end % 1 !== 0) {
          currentVal = (easeOutQuart * (end - start) + start).toFixed(1);
      }

      obj.innerHTML = currentVal + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerHTML = end + suffix;
      }
    };
    window.requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.innerText;
        
        // Don't animate emojis or non-numeric starts
        if(text.includes('🏆') || isNaN(parseFloat(text))) return;
        
        let suffix = '';
        if (text.includes('+')) suffix = '+';
        if (text.includes('★')) suffix = '★';

        const endValue = parseFloat(text.replace(/[^0-9.]/g, ''));
        if(!isNaN(endValue)) {
            el.innerText = '0' + suffix;
            animateValue(el, 0, endValue, 2500, suffix);
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => counterObserver.observe(num));
});

/* ========================================================
   ANALYTICS & EVENT TRACKING
======================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Track WhatsApp Clicks
  const waBtns = document.querySelectorAll('a[href*="wa.me"]');
  waBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if(typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', {
          'event_category': 'Engagement',
          'event_label': 'WhatsApp Button'
        });
      }
      if(typeof fbq === 'function') {
        fbq('trackCustom', 'WhatsAppClick');
      }
    });
  });

  // Track Phone Calls
  const callBtns = document.querySelectorAll('a[href*="tel:"]');
  callBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if(typeof gtag === 'function') {
        gtag('event', 'call_click', {
          'event_category': 'Engagement',
          'event_label': 'Phone Number'
        });
      }
    });
  });

  // Track Forms
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formId = form.getAttribute('id') || 'Contact Form';
      
      // Animate button to show success
      const btn = form.querySelector('button[type="submit"]');
      if(btn) {
        const originalText = btn.innerText;
        btn.innerText = "✓ Request Sent!";
        btn.style.background = "#25D366";
        btn.style.color = "#fff";
        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.background = "";
          btn.style.color = "";
          form.reset();
        }, 3000);
      }

      if(typeof gtag === 'function') {
        gtag('event', 'form_submission', {
          'event_category': 'Lead',
          'event_label': formId
        });
      }
      if(typeof fbq === 'function') {
        fbq('track', 'Lead');
      }
    });
  });
});

/* ========================================================
   GALLERY FILTERING
======================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.gallery-hero .tab-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (!filterBtns.length || !galleryCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        if (filterValue === 'all') {
          card.style.display = '';
        } else {
          if (card.getAttribute('data-category') === filterValue) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });
});


/* ============================================================
   GREENSHIELD PEST CONTROL - MAIN JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ── 1. NAVBAR SCROLL EFFECT ──────────────────────────────
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  // ── 2. MOBILE MENU ───────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Tutup mobile menu saat klik link
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  // ── 3. SMOOTH SCROLL ANCHOR ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });


  // ── 4. SCROLL FADE-UP ANIMATION ──────────────────────────
  const fadeElements = document.querySelectorAll('.fade-up');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger effect untuk elemen yang berdekatan
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeElements.forEach(el => fadeObserver.observe(el));


  // ── 5. GALLERY TABS ──────────────────────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active tab
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter gallery items
      galleryItems.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.3s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });


  // ── 6. COUNTER ANIMATION ─────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(el, target, duration = 2000) {
    const start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('id-ID') + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));


  // ── 7. NEWSLETTER FORM ───────────────────────────────────
  const newsletterForm = document.getElementById('newsletterForm');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('input[type="email"]');
      const email = input.value.trim();

      if (email && isValidEmail(email)) {
        // Di sini bisa ditambahkan integrasi API email marketing
        input.value = '';
        showToast('Terima kasih! Email Anda berhasil didaftarkan.', 'success');
      } else {
        showToast('Masukkan alamat email yang valid.', 'error');
      }
    });
  }


  // ── 8. TOAST NOTIFICATION ────────────────────────────────
  function showToast(message, type = 'info') {
    const existing = document.querySelector('.gs-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'gs-toast';
    toast.textContent = message;

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '90px',
      right: '28px',
      background: type === 'success' ? '#22C55E' : type === 'error' ? '#EF4444' : '#5B21B6',
      color: 'white',
      padding: '14px 20px',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      zIndex: '9999',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      transform: 'translateY(20px)',
      opacity: '0',
      transition: 'all 0.3s ease',
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }


  // ── 9. HELPERS ───────────────────────────────────────────
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  // ── 10. IMAGE PLACEHOLDER FALLBACK ───────────────────────
  // Jika foto belum diganti, tampilkan placeholder yang rapi
  document.querySelectorAll('img[data-placeholder]').forEach(img => {
    img.addEventListener('error', function () {
      const label = this.dataset.placeholder || 'Foto';
      const color = this.dataset.placeholderColor || '#5B21B6';
      this.style.display = 'none';

      const wrap = this.parentElement;
      const ph = document.createElement('div');
      Object.assign(ph.style, {
        width: '100%',
        height: this.style.height || '200px',
        background: `linear-gradient(135deg, ${color}22, ${color}44)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        color: color,
        fontSize: '13px',
        fontWeight: '600',
        borderRadius: 'inherit',
        border: `2px dashed ${color}44`,
      });
      ph.innerHTML = `<span style="font-size:32px">🖼️</span><span>${label}</span>`;
      wrap.insertBefore(ph, this.nextSibling);
    });
  });

});

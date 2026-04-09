/* ================================================================
   IBREU GLOBAL TALENT — JS INTERACTIONS
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     1. NAVBAR SCROLL EFFECT
  ----------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -----------------------------------------------------------
     2. ACTIVE NAV LINK (based on current page)
  ----------------------------------------------------------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .sidebar-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* -----------------------------------------------------------
     3. SIDEBAR / MOBILE MENU
  ----------------------------------------------------------- */
  const hamburger    = document.getElementById('hamburger');
  const sidebar      = document.getElementById('sidebar');
  const sidebarClose = document.getElementById('sidebar-close');
  const overlay      = document.getElementById('sidebar-overlay');

  function openSidebar() {
    sidebar?.classList.add('open');
    overlay?.classList.add('active');
    hamburger?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');
    hamburger?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openSidebar);
  sidebarClose?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);

  // Close sidebar on nav link click
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  /* -----------------------------------------------------------
     4. PREMIUM SCROLL REVEAL (Observer)
  ----------------------------------------------------------- */
  document.body.classList.add('js-active'); // For CSS fallback

  const revealEls = document.querySelectorAll('.reveal, .fade-up, .step-item');
  
  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1, 
      rootMargin: '0px 0px -40px 0px' 
    });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers or if observer fails
    revealEls.forEach(el => el.classList.add('active', 'visible'));
  }

  // Backup reveal check in case observer misses elements (force visibility on long pages)
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.active), .fade-up:not(.active)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add('active', 'visible');
    });
  }, 1000);

  /* -----------------------------------------------------------
     4b. BACKGROUND PARALLAX
  ----------------------------------------------------------- */
  const parallaxHero = document.querySelector('.hero');
  if (parallaxHero) {
      window.addEventListener('scroll', () => {
          const scroll = window.pageYOffset;
          parallaxHero.style.backgroundPositionY = (scroll * 0.5) + 'px';
      }, { passive: true });
  }

  /* -----------------------------------------------------------
     5. FORM VALIDATION & SUBMIT
  ----------------------------------------------------------- */
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          isValid = false;
        }
        // Email format check
        if (field.type === 'email' && field.value.trim()) {
          const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailReg.test(field.value.trim())) {
            field.classList.add('error');
            isValid = false;
          }
        }
      });

      if (!isValid) {
        const firstError = form.querySelector('.error');
        firstError?.focus();
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Success state
      const submitBtn = form.querySelector('[type="submit"]');
      const origText  = submitBtn.innerHTML;
      submitBtn.innerHTML  = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
      submitBtn.disabled   = true;

      setTimeout(() => {
        showSuccess(form, submitBtn, origText);
      }, 1600);
    });
  });

  function showSuccess(form, btn, origText) {
    btn.innerHTML  = origText;
    btn.disabled   = false;
    form.reset();

    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast-success';
    toast.innerHTML = `
      <i data-lucide="check-circle" stroke-width="2.5"></i>
      <div>
        <strong>Application Submitted!</strong>
        <p>Our team will contact you within 24 hours.</p>
      </div>
      <button onclick="this.parentElement.remove()">✕</button>
    `;
    document.body.appendChild(toast);
    
    // Initialize icons in the new toast
    if(typeof lucide !== 'undefined') { lucide.createIcons({ props: { "data-lucide": true }, scope: toast }); }

    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 5000);
  }

  /* -----------------------------------------------------------
     6. SMOOTH SCROLL for anchor links
  ----------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        closeSidebar();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* -----------------------------------------------------------
     7. COUNTER ANIMATION for hero stats
  ----------------------------------------------------------- */
  function animateCounter(el, target, suffix = '') {
    const duration = 1800;
    const start    = performance.now();
    const startVal = 0;

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = Math.floor(startVal + (target - startVal) * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
          cObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObs.observe(c));
  }

  /* -----------------------------------------------------------
     8. CHART.JS INITIALIZATION
  ------------------------------------------- */
  const ctx = document.getElementById('demandChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025 (Prop)'],
        datasets: [{
          label: 'Global Nursing Demand Index',
          data: [65, 72, 85, 92, 98, 105],
          borderColor: '#D4AF37',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#D4AF37'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { color: '#888' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#888' }
          }
        }
      }
    });
  }
});


/* ================================================================
   TOAST STYLES (injected via JS)
   ================================================================ */
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  .toast-success {
    position: fixed;
    bottom: 100px;
    right: 28px;
    background: #111;
    border: 1px solid rgba(212,175,55,0.3);
    border-left: 4px solid #D4AF37;
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    max-width: 340px;
    z-index: 9999;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .toast-success.show {
    transform: translateY(0);
    opacity: 1;
  }
  .toast-success i {
    color: #D4AF37;
    width: 24px;
    height: 24px;
    margin-top: 2px;
    flex-shrink: 0;
  }
  .toast-success strong { color: #fff; display: block; margin-bottom: 2px; font-family: Poppins, sans-serif; }
  .toast-success p { color: rgba(255,255,255,0.55); margin: 0; font-size: 0.8rem; }
  .toast-success button {
    background: none; border: none; color: rgba(255,255,255,0.3);
    cursor: pointer; font-size: 0.9rem; margin-left: auto; padding: 0;
    align-self: flex-start; transition: color 0.3s;
  }
  .toast-success button:hover { color: #fff; }
`;
document.head.appendChild(toastStyle);


// Initialize Lucide Icons
if(typeof lucide !== 'undefined') { lucide.createIcons(); }

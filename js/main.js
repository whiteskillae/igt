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
     5. FORM VALIDATION & SUBMIT (HANDLED BY WEB3FORMS SECTION)
  ----------------------------------------------------------- */
  // Redundant block removed to avoid conflicts with Web3Forms handler below.

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
     7. COUNTER ANIMATION — bulletproof trigger
  ----------------------------------------------------------- */
  function animateCounter(el, target, suffix) {
    if (el.dataset.animated) return; // prevent double-run
    el.dataset.animated = 'true';
    const duration = 2200;
    const start    = performance.now();
    el.textContent = '0' + suffix;

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.floor(target * eased);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function tryRunCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      if (!el.dataset.animated) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          animateCounter(el, parseInt(el.dataset.count, 10), el.dataset.suffix || '');
        }
      }
    });
  }

  // Run on scroll with throttle
  let counterThrottle = false;
  window.addEventListener('scroll', () => {
    if (!counterThrottle) {
      counterThrottle = true;
      requestAnimationFrame(() => {
        tryRunCounters();
        counterThrottle = false;
      });
    }
  }, { passive: true });

  // Also run after a delay for stat boxes visible on page load
  setTimeout(tryRunCounters, 600);
  setTimeout(tryRunCounters, 1500);

  /* -----------------------------------------------------------
     8. TABBED PLACEMENT CHART INITIALIZATION
  ------------------------------------------- */
  const placementCtx = document.getElementById('placementChart');
  let placementChart;

  const chartData = {
    nursing: {
      labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      dataset: [85, 92, 105, 115, 128, 142]
    },
    taxi: {
      labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      dataset: [150, 180, 210, 260, 305, 340]
    },
    australia: {
      labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      dataset: [22, 28, 35, 42, 48, 55]
    }
  };

  if (placementCtx && typeof Chart !== 'undefined') {
    placementChart = new Chart(placementCtx, {
      type: 'line',
      data: {
        labels: chartData.nursing.labels,
        datasets: [{
          label: 'Monthly Placements',
          data: chartData.nursing.dataset,
          borderColor: '#D4AF37',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 4,
          pointBackgroundColor: '#D4AF37',
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#000000',
            bodyColor: '#333333',
            borderColor: '#D4AF37',
            borderWidth: 2,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return context.parsed.y + ' Placements';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            border: { display: false },
            ticks: { color: '#333333', font: { size: 13, family: 'Inter', weight: 'bold' } }
          },
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#333333', font: { size: 13, family: 'Inter', weight: 'bold' } }
          }
        }
      }
    });

    // Make switchChart global so the buttons can call it
    window.switchChart = function(type) {
      if (!placementChart) return;
      
      // Update active tab styling
      document.querySelectorAll('.chart-tab-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById('tab-' + type).classList.add('active');

      // Update data
      placementChart.data.labels = chartData[type].labels;
      placementChart.data.datasets[0].data = chartData[type].dataset;
      placementChart.update();
    };
  }

  /* -----------------------------------------------------------
     10. FAQ ACCORDION LOGIC
  ------------------------------------------- */
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');
      
      // Close all other FAQs
      document.querySelectorAll('.faq-item.active').forEach(activeItem => {
        if (activeItem !== item) {
          activeItem.classList.remove('active');
          activeItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* -----------------------------------------------------------
     11. SWIPER CAROUSEL (TESTIMONIALS)
  ------------------------------------------- */
  if (typeof Swiper !== 'undefined' && document.querySelector('.testimonial-swiper')) {
    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

  /* -----------------------------------------------------------
     12. GLOBAL FORM SUBMISSION (Web3Forms) & RATE LIMITING
  ------------------------------------------- */
  const WEB3_ACCESS_KEY = "8394a489-db33-4496-8ff0-911ea5268d2a";
  const WA_NUMBER = "+971527171134";

  function showFormMessage(type, title, message, waData = null) {
    let toastEl = document.getElementById('form-status-toast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'form-status-toast';
      toastEl.className = 'toast-success';
      document.body.appendChild(toastEl);
    }
    
    let icon = type === 'success' ? 'check-circle' : (type === 'limit' ? 'clock' : 'alert-circle');
    let color = type === 'success' ? '#D4AF37' : (type === 'limit' ? '#3b82f6' : '#ef4444');
    let waButtonHTML = '';
    
    // Auto-show WhatsApp button if it's an error or if data exists
    if (waData || type === 'error') {
      let text = "Hi IBREU Team, I have an inquiry:\n" + (waData || "");
      let waLink = `https://wa.me/${WA_NUMBER.replace('+', '')}?text=${encodeURIComponent(text)}`;
      waButtonHTML = `<a href="${waLink}" target="_blank" style="display:inline-flex; align-items:center; gap:8px; margin-top:10px; background:#25D366; color:#fff; padding:10px 16px; border-radius:6px; text-decoration:none; font-size:0.9rem; font-weight:600; font-family:var(--font-body); box-shadow:0 4px 12px rgba(37,211,102,0.3);"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.996 0c-6.627 0-12 5.373-12 12 0 2.112.548 4.103 1.517 5.845l-1.517 6.155 6.291-1.65c1.722.9 3.655 1.397 5.709 1.397 6.627 0 12-5.373 12-12s-5.373-12-12-12zm-4.464 7.202c.224-.045.45-.045.672-.045.334 0 .684.09.967.433.284.341.874 1.137.967 1.332.09.195.15.422.045.684s-.225.433-.375.617c-.15.185-.315.39-.45.541-.15.15-.315.315-.15.615.165.3.705 1.196 1.516 1.921.998.885 1.876 1.155 2.176 1.305.3.15.48.15.675 0s.54-.615.69-.825.315-.195.585-.09c.27.105 1.696.825 1.981.975.285.15.48.225.555.36s.075.645-.21 1.23c-.285.585-1.696 1.125-2.326 1.17s-1.276.045-3.056-.54c-1.78-.585-3.921-2.43-5.266-4.08-1.344-1.65-2.025-3.414-1.95-5.221C6.46 9.176 7.256 8.351 7.532 7.202z"/></svg> Send via WhatsApp</a>`;
    }

    toastEl.innerHTML = `
      <i data-lucide="${icon}" style="color:${color}"></i>
      <div style="flex:1;">
        <strong style="color:${color}">${title}</strong>
        <p style="color:#fff;">${message}</p>
        ${waButtonHTML}
      </div>
      <button onclick="this.parentElement.classList.remove('show')"><i data-lucide="x"></i></button>
    `;
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    toastEl.style.borderLeftColor = color;
    toastEl.classList.add('show');
    
    // Auto hide success/limit after 6s, keep error visible
    if (type !== 'error') {
      setTimeout(() => toastEl.classList.remove('show'), 6000);
    }
  }

  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // 1. VALIDATION
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          isValid = false;
        }
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

      // 2. RATE LIMITING
      const today = new Date().toDateString();
      let storage = JSON.parse(localStorage.getItem('igt_submissions')) || { date: today, count: 0 };
      
      if (storage.date !== today) {
        storage = { date: today, count: 0 };
      }
      
      if (storage.count >= 5) {
        showFormMessage('limit', 'Daily Limit Reached', 'You have sent multiple inquiries today. Please wait until tomorrow or contact us via WhatsApp.');
        return;
      }

      // 3. DATA COLLECTION (Captcha removed as requested)


      // 4. DATA COLLECTION
      const formData = new FormData(form);
      let fullMessageSummary = "";

      // Build a readable summary for the 'message' field
      formData.forEach((value, key) => {
        if (key !== 'access_key' && key !== 'subject' && key !== 'h-captcha-response' && key !== 'from_name' && key !== 'message') {
          fullMessageSummary += `${key.toUpperCase()}: ${value}\n`;
        }
      });

      // Phone validation
      const phoneInput = form.querySelector('input[type="tel"]');
      if (phoneInput && phoneInput.value) {
        const digitsOnly = phoneInput.value.replace(/\D/g, '');
        if (digitsOnly.length < 7) {
          showFormMessage('limit', 'Invalid Phone', 'Please enter a valid mobile number.');
          return;
        }
      }

      // Add required/overriding fields to FormData
      formData.set("access_key", WEB3_ACCESS_KEY);
      if (!formData.get("subject")) {
        formData.set("subject", `New Inquiry from ${formData.get("name") || 'Web Lead'}`);
      }
      formData.set("from_name", "IBREU Global Talent Portal");
      
      // If there's an existing message, append the summary to it
      const existingMsg = formData.get("message") || "";
      formData.set("message", `--- Form Details ---\n${fullMessageSummary}\n--- Message ---\n${existingMsg}`);

      const btn = form.querySelector('button[type="submit"]');
      const ogBtnText = btn ? btn.innerHTML : "Submit";
      if (btn) {
        btn.innerHTML = '<span class="loading-spinner"></span> Sending...';
        btn.disabled = true;
      }

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        const data = await response.json();

        if (data.success) {
          storage.count++;
          localStorage.setItem('igt_submissions', JSON.stringify(storage));
          showFormMessage('success', 'Sent Successfully!', 'Your inquiry has been received. Our team will contact you shortly.');
          form.reset();
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (error) {
        console.error("Submission Error:", error);
        // Extract the summary for the WhatsApp fallback in case of total failure
        const summaryForWA = `--- Form Details ---\n${fullMessageSummary}\n--- Message ---\n${formData.get("message") || ""}`;
        showFormMessage('error', 'Submission Failed', 'There was a technical problem. Please try again or use WhatsApp.', summaryForWA);
      } finally {
        if (btn) {
          btn.innerHTML = ogBtnText;
          btn.disabled = false;
        }
      }
    });
  });

  /* -----------------------------------------------------------
     13. JOBS DIRECTORY MODAL
     ----------------------------------------------------------- */
  const jobsModal = document.getElementById('jobs-modal');
  const openModalBtn = document.getElementById('open-jobs-directory');
  const closeModalBtn = document.getElementById('modal-close');
  const modalBg = document.getElementById('modal-bg');

  if (jobsModal && openModalBtn) {
    const openModal = () => {
      jobsModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Refresh icons in case any weren't rendered
      if(typeof lucide !== 'undefined') lucide.createIcons({ scope: jobsModal });
    };

    const closeModal = () => {
      jobsModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn?.addEventListener('click', closeModal);
    modalBg?.addEventListener('click', closeModal);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && jobsModal.classList.contains('active')) {
        closeModal();
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

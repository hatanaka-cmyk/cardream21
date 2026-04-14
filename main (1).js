/**
 * CAR DREAM 買取実績LP - Main JavaScript
 * =========================================
 */

'use strict';

/* ------------------------------------------------
   1. DOM Ready
------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initScrollHeader();
  initFixedCTA();
  initFadeIn();
  initCountUp();
  initFilterTabs();
  initFAQ();
  initForm();
  initSmoothScroll();
});


/* ------------------------------------------------
   2. Hamburger Menu
------------------------------------------------ */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('global-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.classList.toggle('active', isOpen);
    btn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-label', 'メニューを開く');
    });
  });
}


/* ------------------------------------------------
   3. Scroll-based Header
------------------------------------------------ */
function initScrollHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 60
      ? '0 2px 20px rgba(0,0,0,0.3)'
      : 'none';
  }, { passive: true });
}


/* ------------------------------------------------
   4. Fixed CTA (show after scroll past hero)
------------------------------------------------ */
function initFixedCTA() {
  const fixedCTA = document.getElementById('fixed-cta');
  const hero = document.getElementById('hero');
  if (!fixedCTA || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      fixedCTA.classList.toggle('show', !entry.isIntersecting);
    },
    { threshold: 0.1 }
  );

  observer.observe(hero);
}


/* ------------------------------------------------
   5. Fade-in on Scroll (Intersection Observer)
------------------------------------------------ */
function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay based on index within parent
          const siblings = Array.from(entry.target.parentElement.children);
          const idx = siblings.indexOf(entry.target);
          const delay = Math.min(idx * 100, 400);

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}


/* ------------------------------------------------
   6. Count-up Animation (Stats bar)
------------------------------------------------ */
function initCountUp() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCountUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  nums.forEach(num => observer.observe(num));
}

function animateCountUp(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.round(eased * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}


/* ------------------------------------------------
   7. Filter Tabs (Results Section)
------------------------------------------------ */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.result-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
          return;
        }

        const categories = (card.dataset.category || '').split(' ');
        const show = categories.includes(filter);
        card.classList.toggle('hidden', !show);
      });

      // Re-trigger fade-in for visible cards
      cards.forEach(card => {
        if (!card.classList.contains('hidden')) {
          card.classList.remove('visible');
          requestAnimationFrame(() => {
            card.classList.add('visible');
          });
        }
      });
    });
  });
}


/* ------------------------------------------------
   8. FAQ Accordion
------------------------------------------------ */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      items.forEach(i => {
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        i.querySelector('.faq-answer').classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
}


/* ------------------------------------------------
   9. Form Validation & Submission
------------------------------------------------ */
function initForm() {
  const form = document.getElementById('estimate-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isValid = validateForm(form);
    if (isValid) {
      handleFormSubmit(form);
    }
  });

  // Real-time validation on blur
  ['name', 'tel', 'car-model'].forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (input) {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearError(input));
    }
  });
}

function validateForm(form) {
  let valid = true;

  const name = document.getElementById('name');
  const tel = document.getElementById('tel');
  const carModel = document.getElementById('car-model');

  if (!validateField(name)) valid = false;
  if (!validateField(tel)) valid = false;
  if (!validateField(carModel)) valid = false;

  return valid;
}

function validateField(input) {
  const value = input.value.trim();
  const id = input.id;
  const errorEl = document.getElementById(`${id}-error`);

  clearError(input);

  if (!value) {
    showError(input, errorEl, 'この項目は必須です。');
    return false;
  }

  if (id === 'tel') {
    const telPattern = /^[0-9\-\+\(\)\s]{10,15}$/;
    if (!telPattern.test(value)) {
      showError(input, errorEl, '正しい電話番号を入力してください（例：090-1234-5678）。');
      return false;
    }
  }

  return true;
}

function showError(input, errorEl, message) {
  input.classList.add('error');
  if (errorEl) errorEl.textContent = message;
}

function clearError(input) {
  input.classList.remove('error');
  const errorEl = document.getElementById(`${input.id}-error`);
  if (errorEl) errorEl.textContent = '';
}

function handleFormSubmit(form) {
  const btn = document.getElementById('submit-btn');
  const successDiv = document.getElementById('form-success');

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 送信中...';
  }

  // Simulate async submission (replace with real fetch to Netlify Forms / Formspree)
  setTimeout(() => {
    form.style.display = 'none';
    if (successDiv) successDiv.style.display = 'block';

    // Scroll to success message
    if (successDiv) {
      successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 1200);
}


/* ------------------------------------------------
   10. Smooth Scroll (for hash links)
------------------------------------------------ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      e.preventDefault();

      const headerHeight = 64;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ------------------------------------------------
   11. Image Error Fallback
------------------------------------------------ */
document.querySelectorAll('.rc-img-wrap img').forEach(img => {
  img.addEventListener('error', function () {
    this.style.display = 'none';
    const fallback = this.nextElementSibling;
    if (fallback) fallback.style.display = 'flex';
  });
});

/* =========================================
   DENTAL CARE - MAIN JAVASCRIPT
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
  initMobileMenu();
  initScrollAnimations();
  initMagneticButtons();
  initFAQ();
  initParallax();
  initFormValidation();
  initCookieConsent();
});

/* =========================================
   NAVIGATION
   ========================================= */
function initNavigation() {
  const nav = document.querySelector('.nav');

  if (!nav) return;

  // Add scrolled class on scroll
  function handleScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check initial state

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightActiveSection() {
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveSection, { passive: true });
}

/* =========================================
   MOBILE MENU
   ========================================= */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const body = document.body;

  if (!hamburger || !mobileMenu) return;

  function toggleMenu() {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* =========================================
   SCROLL ANIMATIONS
   ========================================= */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all fade-up elements
  document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
    observer.observe(el);
  });

  // Add fade-up class to common elements if not present
  const animatableElements = document.querySelectorAll(
    '.service-card, .team-card, .testimonial-card, .why-card, .blog-card, .faq-item'
  );

  animatableElements.forEach(el => {
    if (!el.classList.contains('fade-up') && !el.classList.contains('fade-in')) {
      el.classList.add('fade-up');
      observer.observe(el);
    }
  });
}

/* =========================================
   MAGNETIC BUTTONS
   ========================================= */
function initMagneticButtons() {
  const magneticButtons = document.querySelectorAll('.magnetic-btn');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

/* =========================================
   FAQ ACCORDION
   ========================================= */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      item.classList.toggle('active', !isActive);
    });
  });
}

/* =========================================
   PARALLAX EFFECT
   ========================================= */
function initParallax() {
  const heroImage = document.querySelector('.hero-image');

  if (!heroImage) return;

  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    heroImage.style.transform = `translateY(${scrolled * 0.15}px)`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/* =========================================
   FORM VALIDATION
   ========================================= */
function initFormValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      // Remove previous error states
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      form.querySelectorAll('.error-message').forEach(el => el.remove());

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');

          const errorMsg = document.createElement('span');
          errorMsg.className = 'error-message';
          errorMsg.textContent = 'Ovo polje je obavezno';
          errorMsg.style.cssText = 'color: #EF4444; font-size: 0.85rem; margin-top: 4px; display: block;';
          field.parentNode.appendChild(errorMsg);
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');

            const errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Unesite validnu email adresu';
            errorMsg.style.cssText = 'color: #EF4444; font-size: 0.85rem; margin-top: 4px; display: block;';
            field.parentNode.appendChild(errorMsg);
          }
        }

        // Phone validation
        if (field.type === 'tel' && field.value.trim()) {
          const phoneRegex = /^[\d\s\+\-\(\)]{9,}$/;
          if (!phoneRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');

            const errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Unesite validan broj telefona';
            errorMsg.style.cssText = 'color: #EF4444; font-size: 0.85rem; margin-top: 4px; display: block;';
            field.parentNode.appendChild(errorMsg);
          }
        }
      });

      // Add error styling
      const style = document.createElement('style');
      style.textContent = '.error { border-color: #EF4444 !important; }';
      document.head.appendChild(style);

      if (isValid) {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.innerHTML = `
          <div style="background: #10B981; color: white; padding: 16px; border-radius: 8px; margin-top: 16px; text-align: center;">
            <strong>Hvala vam!</strong> Vaša poruka je uspešno poslata. Javićemo vam se uskoro.
          </div>
        `;
        form.appendChild(successMsg);
        form.reset();

        // Remove success message after 5 seconds
        setTimeout(() => {
          successMsg.remove();
        }, 5000);
      }
    });

    // Remove error state on input
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const errorMsg = field.parentNode.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
      });
    });
  });
}

/* =========================================
   COOKIE CONSENT
   ========================================= */
function initCookieConsent() {
  const cookieConsent = document.querySelector('.cookie-consent');
  const acceptBtn = document.querySelector('.cookie-accept');
  const declineBtn = document.querySelector('.cookie-decline');

  if (!cookieConsent) return;

  // Check if user already made a choice
  if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      cookieConsent.classList.add('show');
    }, 2000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieConsent.classList.remove('show');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieConsent.classList.remove('show');
    });
  }
}

/* =========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ========================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');

    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/* =========================================
   COUNTER ANIMATION
   ========================================= */
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }

  updateCounter();
}

// Initialize counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count);
      if (target) {
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(counter => {
  counterObserver.observe(counter);
});

/* =========================================
   LAZY LOADING IMAGES
   ========================================= */
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading is supported
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  // Fallback for older browsers
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/* =========================================
   TESTIMONIALS CAROUSEL (Optional)
   ========================================= */
function initTestimonialsCarousel() {
  const carousel = document.querySelector('.testimonials-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.testimonial-card');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  let currentIndex = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - index) * 100}%)`;
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    });
  }

  showSlide(0);
}

/* =========================================
   PERFORMANCE: Debounce utility
   ========================================= */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* =========================================
   PRINT STYLES TRIGGER
   ========================================= */
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
    el.classList.add('visible');
  });
});

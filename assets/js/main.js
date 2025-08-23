// ===== MAIN JAVASCRIPT FILE =====

// DOM Elements
const elements = {
  loadingScreen: document.getElementById('loading-screen'),
  navbar: document.getElementById('navbar'),
  navToggle: document.getElementById('nav-toggle'),
  navMenu: document.getElementById('nav-menu'),
  navLinks: document.querySelectorAll('.nav-link'),
  
  // Countdown
  daysEl: document.getElementById('days'),
  hoursEl: document.getElementById('hours'),
  minutesEl: document.getElementById('minutes'),
  
  // Buttons
  surpriseBtn: document.getElementById('surprise-btn'),
  openLetterBtn: document.getElementById('open-letter-btn'),
  openLetterMain: document.getElementById('open-letter-main'),
  closeLetterBtn: document.getElementById('close-letter'),
  
  // Modal
  letterModal: document.getElementById('letter-modal'),
  modalOverlay: document.querySelector('.modal-overlay'),
  
  // Gallery
  galleryItems: document.querySelectorAll('.gallery-item'),
  filterBtns: document.querySelectorAll('.filter-btn'),
  lightbox: document.getElementById('lightbox'),
  lightboxImage: document.querySelector('.lightbox-image'),
  lightboxTitle: document.querySelector('.lightbox-title'),
  lightboxDescription: document.querySelector('.lightbox-description'),
  lightboxClose: document.querySelector('.lightbox-close'),
  lightboxPrev: document.querySelector('.lightbox-prev'),
  lightboxNext: document.querySelector('.lightbox-next'),
  
  // Messages Carousel
  messageItems: document.querySelectorAll('.message-item'),
  prevMessageBtn: document.getElementById('prev-message'),
  nextMessageBtn: document.getElementById('next-message'),
  carouselDots: document.querySelectorAll('.dot'),
  
  // Footer
  currentYearEl: document.getElementById('current-year')
};

// State
let currentMessageIndex = 0;
let currentGalleryIndex = 0;
let galleryImages = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Hide loading screen after a delay
  setTimeout(() => {
    if (elements.loadingScreen) {
      elements.loadingScreen.classList.add('hidden');
    }
  }, 1500);
  
  // Initialize all components
  initializeNavigation();
  initializeCountdown();
  initializeModals();
  initializeGallery();
  initializeCarousel();
  initializeScrollEffects();
  initializeSurpriseButton();
  initializeFooter();
  
  // Start animations
  startScrollAnimations();
}

// ===== NAVIGATION =====
function initializeNavigation() {
  // Mobile menu toggle
  if (elements.navToggle && elements.navMenu) {
    elements.navToggle.addEventListener('click', toggleMobileMenu);
  }
  
  // Smooth scroll for navigation links
  elements.navLinks.forEach(link => {
    link.addEventListener('click', handleNavClick);
  });
  
  // Navbar scroll effect
  window.addEventListener('scroll', handleNavbarScroll);
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!elements.navToggle.contains(e.target) && !elements.navMenu.contains(e.target)) {
      elements.navMenu.classList.remove('active');
    }
  });
}

function toggleMobileMenu() {
  elements.navMenu.classList.toggle('active');
}

function handleNavClick(e) {
  e.preventDefault();
  const targetId = e.target.getAttribute('href');
  const targetElement = document.querySelector(targetId);
  
  if (targetElement) {
    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
  
  // Close mobile menu
  elements.navMenu.classList.remove('active');
}

function handleNavbarScroll() {
  if (window.scrollY > 100) {
    elements.navbar.classList.add('scrolled');
  } else {
    elements.navbar.classList.remove('scrolled');
  }
}

// ===== COUNTDOWN =====
function initializeCountdown() {
  // Data de início do namoro
  const anniversaryDate = new Date('2021-08-23T00:00:00');

  function updateCountdown() {
    const now = new Date();
    const timeDiff = now - anniversaryDate; // diferença invertida → tempo decorrido

    if (timeDiff >= 0) {
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      if (elements.daysEl) elements.daysEl.textContent = days.toString().padStart(2, '0');
      if (elements.hoursEl) elements.hoursEl.textContent = hours.toString().padStart(2, '0');
      if (elements.minutesEl) elements.minutesEl.textContent = minutes.toString().padStart(2, '0');
      if (elements.secondsEl) elements.secondsEl.textContent = seconds.toString().padStart(2, '0');
    } else {
      // Caso a data seja no futuro (ainda não começou)
      if (elements.daysEl) elements.daysEl.textContent = '00';
      if (elements.hoursEl) elements.hoursEl.textContent = '00';
      if (elements.minutesEl) elements.minutesEl.textContent = '00';
      if (elements.secondsEl) elements.secondsEl.textContent = '00';
    }
  }
  
  // Update immediately and then every minute
  updateCountdown();
  setInterval(updateCountdown, 60000);
}

// ===== MODALS =====
function initializeModals() {
  // Letter modal
  if (elements.openLetterBtn) {
    elements.openLetterBtn.addEventListener('click', openLetterModal);
  }
  
  if (elements.openLetterMain) {
    elements.openLetterMain.addEventListener('click', openLetterModal);
  }
  
  if (elements.closeLetterBtn) {
    elements.closeLetterBtn.addEventListener('click', closeLetterModal);
  }
  
  if (elements.modalOverlay) {
    elements.modalOverlay.addEventListener('click', closeLetterModal);
  }
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLetterModal();
      closeLightbox();
    }
  });
}

function openLetterModal() {
  if (elements.letterModal) {
    elements.letterModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add some sparkle effect
    createSparkleEffect();
  }
}

function closeLetterModal() {
  if (elements.letterModal) {
    elements.letterModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ===== GALLERY =====
function initializeGallery() {
  // Initialize gallery images array
  galleryImages = Array.from(elements.galleryItems).map((item, index) => ({
    src: item.querySelector('img').src,
    title: item.querySelector('.gallery-info h4')?.textContent || '',
    description: item.querySelector('.gallery-info p')?.textContent || '',
    index: index
  }));
  
  // Filter functionality
  elements.filterBtns.forEach(btn => {
    btn.addEventListener('click', handleFilterClick);
  });
  
  // Gallery item clicks
  elements.galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });
  
  // Lightbox controls
  if (elements.lightboxClose) {
    elements.lightboxClose.addEventListener('click', closeLightbox);
  }
  
  if (elements.lightboxPrev) {
    elements.lightboxPrev.addEventListener('click', showPrevImage);
  }
  
  if (elements.lightboxNext) {
    elements.lightboxNext.addEventListener('click', showNextImage);
  }
  
  // Lightbox overlay click
  if (elements.lightbox) {
    elements.lightbox.addEventListener('click', (e) => {
      if (e.target === elements.lightbox || e.target.classList.contains('lightbox-overlay')) {
        closeLightbox();
      }
    });
  }
  
  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (elements.lightbox.classList.contains('active')) {
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
    }
  });
}

function handleFilterClick(e) {
  const filter = e.target.dataset.filter;
  
  // Update active filter button
  elements.filterBtns.forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
  
  // Filter gallery items
  elements.galleryItems.forEach(item => {
    const category = item.dataset.category;
    if (filter === 'all' || category === filter) {
      item.style.display = 'block';
      item.style.animation = 'fadeInUp 0.5s ease forwards';
    } else {
      item.style.display = 'none';
    }
  });
}

function openLightbox(index) {
  currentGalleryIndex = index;
  const image = galleryImages[index];
  
  if (elements.lightboxImage) elements.lightboxImage.src = image.src;
  if (elements.lightboxTitle) elements.lightboxTitle.textContent = image.title;
  if (elements.lightboxDescription) elements.lightboxDescription.textContent = image.description;
  
  elements.lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  elements.lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function showPrevImage() {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
  openLightbox(currentGalleryIndex);
}

function showNextImage() {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
  openLightbox(currentGalleryIndex);
}

// ===== MESSAGES CAROUSEL =====
function initializeCarousel() {
  // Navigation buttons
  if (elements.prevMessageBtn) {
    elements.prevMessageBtn.addEventListener('click', showPrevMessage);
  }
  
  if (elements.nextMessageBtn) {
    elements.nextMessageBtn.addEventListener('click', showNextMessage);
  }
  
  // Dots navigation
  elements.carouselDots.forEach((dot, index) => {
    dot.addEventListener('click', () => showMessage(index));
  });
  
  // Auto-play carousel
  setInterval(showNextMessage, 8000);
}

function showMessage(index) {
  // Hide all messages
  elements.messageItems.forEach(item => item.classList.remove('active'));
  elements.carouselDots.forEach(dot => dot.classList.remove('active'));
  
  // Show selected message
  if (elements.messageItems[index]) {
    elements.messageItems[index].classList.add('active');
    elements.carouselDots[index].classList.add('active');
    currentMessageIndex = index;
  }
}

function showPrevMessage() {
  const prevIndex = (currentMessageIndex - 1 + elements.messageItems.length) % elements.messageItems.length;
  showMessage(prevIndex);
}

function showNextMessage() {
  const nextIndex = (currentMessageIndex + 1) % elements.messageItems.length;
  showMessage(nextIndex);
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
      }
    });
  }, observerOptions);
  
  // Observe all elements with data-aos attribute
  document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
  });
}

function startScrollAnimations() {
  // Add stagger delay to timeline items
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
  });
  
  // Add stagger delay to dream cards
  const dreamCards = document.querySelectorAll('.dream-card');
  dreamCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

// ===== SURPRISE BUTTON =====
function initializeSurpriseButton() {
  if (elements.surpriseBtn) {
    elements.surpriseBtn.addEventListener('click', handleSurpriseClick);
  }
}

function handleSurpriseClick() {
  // Create heart explosion effect
  createHeartExplosion();
  
  // Vibrate if supported
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
  }
  
  // Open letter modal after a short delay
  setTimeout(() => {
    openLetterModal();
  }, 1000);
  
  // Add some confetti effect
  createConfettiEffect();
}

// ===== EFFECTS =====
function createHeartExplosion() {
  const button = elements.surpriseBtn;
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 20; i++) {
    createFloatingHeart(centerX, centerY);
  }
}

function createFloatingHeart(x, y) {
  const heart = document.createElement('div');
  heart.textContent = '💖';
  heart.style.position = 'fixed';
  heart.style.left = x + 'px';
  heart.style.top = y + 'px';
  heart.style.fontSize = '20px';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '9999';
  heart.style.animation = `floatHeart 3s ease-out forwards`;
  
  // Random direction
  const angle = Math.random() * Math.PI * 2;
  const distance = 100 + Math.random() * 100;
  const endX = x + Math.cos(angle) * distance;
  const endY = y + Math.sin(angle) * distance - 50;
  
  heart.style.setProperty('--end-x', endX + 'px');
  heart.style.setProperty('--end-y', endY + 'px');
  
  document.body.appendChild(heart);
  
  setTimeout(() => {
    heart.remove();
  }, 3000);
}

function createSparkleEffect() {
  const sparkles = ['✨', '⭐', '💫', '🌟'];
  
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const sparkle = document.createElement('div');
      sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
      sparkle.style.position = 'fixed';
      sparkle.style.left = Math.random() * window.innerWidth + 'px';
      sparkle.style.top = Math.random() * window.innerHeight + 'px';
      sparkle.style.fontSize = '20px';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.zIndex = '9999';
      sparkle.style.animation = 'sparkle 2s ease-out forwards';
      
      document.body.appendChild(sparkle);
      
      setTimeout(() => {
        sparkle.remove();
      }, 2000);
    }, i * 100);
  }
}

function createConfettiEffect() {
  const colors = ['#ff6b9d', '#7dd3fc', '#fbbf24', '#a78bfa', '#34d399'];
  
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-10px';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '9999';
      confetti.style.animation = 'confetti 3s ease-out forwards';
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }, i * 50);
  }
}

// ===== FOOTER =====
function initializeFooter() {
  if (elements.currentYearEl) {
    elements.currentYearEl.textContent = new Date().getFullYear();
  }
}

// ===== UTILITY FUNCTIONS =====
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

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
});

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images
function lazyLoadImages() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// ===== ACCESSIBILITY =====
// Focus management for modals
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  });
  
  firstFocusableElement.focus();
}

// Apply focus trap when modal opens
function openLetterModal() {
  if (elements.letterModal) {
    elements.letterModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    trapFocus(elements.letterModal);
    createSparkleEffect();
  }
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeApp,
    handleNavClick,
    updateCountdown,
    showMessage,
    createHeartExplosion
  };
}


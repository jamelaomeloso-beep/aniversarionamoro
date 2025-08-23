// ===== ADVANCED ANIMATIONS SYSTEM =====

class AnimationController {
  constructor() {
    this.observers = new Map();
    this.animatedElements = new Set();
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.init();
  }
  
  init() {
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupLoadingAnimations();
    this.setupParallaxEffects();
    this.setupMorphingShapes();
    this.setupTextAnimations();
  }
  
  // ===== SCROLL ANIMATIONS =====
  setupScrollAnimations() {
    if (this.isReducedMotion) return;
    
    const observerOptions = {
      threshold: [0.1, 0.3, 0.5, 0.7],
      rootMargin: '0px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.triggerScrollAnimation(entry.target, entry.intersectionRatio);
        }
      });
    }, observerOptions);
    
    // Observe elements with scroll animations
    document.querySelectorAll('[data-aos]').forEach(el => {
      scrollObserver.observe(el);
    });
    
    this.observers.set('scroll', scrollObserver);
  }
  
  triggerScrollAnimation(element, ratio) {
    if (this.animatedElements.has(element)) return;
    
    const animationType = element.dataset.aos;
    const delay = element.dataset.aosDelay || 0;
    
    setTimeout(() => {
      element.classList.add('aos-animate');
      this.animatedElements.add(element);
      
      // Add specific animation based on type
      switch (animationType) {
        case 'fade-up':
          this.animateFadeUp(element);
          break;
        case 'fade-left':
          this.animateFadeLeft(element);
          break;
        case 'fade-right':
          this.animateFadeRight(element);
          break;
        case 'scale-in':
          this.animateScaleIn(element);
          break;
        case 'flip-in':
          this.animateFlipIn(element);
          break;
        case 'slide-up':
          this.animateSlideUp(element);
          break;
        default:
          this.animateFadeUp(element);
      }
    }, delay);
  }
  
  animateFadeUp(element) {
    element.style.animation = 'fadeInUp 0.8s ease-out forwards';
  }
  
  animateFadeLeft(element) {
    element.style.animation = 'fadeInLeft 0.8s ease-out forwards';
  }
  
  animateFadeRight(element) {
    element.style.animation = 'fadeInRight 0.8s ease-out forwards';
  }
  
  animateScaleIn(element) {
    element.style.animation = 'scaleIn 0.6s ease-out forwards';
  }
  
  animateFlipIn(element) {
    element.style.animation = 'flipInY 0.8s ease-out forwards';
  }
  
  animateSlideUp(element) {
    element.style.animation = 'slideInUp 0.8s ease-out forwards';
  }
  
  // ===== HOVER EFFECTS =====
  setupHoverEffects() {
    if (this.isReducedMotion) return;
    
    // Enhanced button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
      this.addButtonHoverEffect(btn);
    });
    
    // Card hover effects
    document.querySelectorAll('.dream-card, .timeline-content, .gallery-item').forEach(card => {
      this.addCardHoverEffect(card);
    });
    
    // Image hover effects
    document.querySelectorAll('.gallery-item img').forEach(img => {
      this.addImageHoverEffect(img);
    });
  }
  
  addButtonHoverEffect(button) {
    button.addEventListener('mouseenter', () => {
      if (!this.isReducedMotion) {
        button.style.transform = 'translateY(-3px) scale(1.02)';
        button.style.boxShadow = '0 10px 30px rgba(255, 107, 157, 0.4)';
        this.createRippleEffect(button);
      }
    });
    
    button.addEventListener('mouseleave', () => {
      if (!this.isReducedMotion) {
        button.style.transform = 'translateY(0) scale(1)';
        button.style.boxShadow = '';
      }
    });
    
    button.addEventListener('click', (e) => {
      this.createClickEffect(e.target, e.clientX, e.clientY);
    });
  }
  
  addCardHoverEffect(card) {
    card.addEventListener('mouseenter', () => {
      if (!this.isReducedMotion) {
        card.style.transform = 'translateY(-8px) rotateX(2deg)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      if (!this.isReducedMotion) {
        card.style.transform = 'translateY(0) rotateX(0)';
        card.style.boxShadow = '';
      }
    });
    
    // Add tilt effect based on mouse position
    card.addEventListener('mousemove', (e) => {
      if (this.isReducedMotion) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * -10;
      const rotateY = (x - centerX) / centerX * 10;
      
      card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  }
  
  addImageHoverEffect(img) {
    const container = img.parentElement;
    
    container.addEventListener('mouseenter', () => {
      if (!this.isReducedMotion) {
        img.style.transform = 'scale(1.1) rotate(2deg)';
        img.style.filter = 'brightness(1.1) saturate(1.2)';
      }
    });
    
    container.addEventListener('mouseleave', () => {
      if (!this.isReducedMotion) {
        img.style.transform = 'scale(1) rotate(0deg)';
        img.style.filter = 'brightness(1) saturate(1)';
      }
    });
  }
  
  // ===== LOADING ANIMATIONS =====
  setupLoadingAnimations() {
    // Stagger animation for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.2}s`;
      item.classList.add('stagger-item');
    });
    
    // Stagger animation for dream cards
    const dreamCards = document.querySelectorAll('.dream-card');
    dreamCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.15}s`;
      card.classList.add('stagger-item');
    });
    
    // Stagger animation for gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
      item.classList.add('stagger-item');
    });
  }
  
  // ===== PARALLAX EFFECTS =====
  setupParallaxEffects() {
    if (this.isReducedMotion) return;
    
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    window.addEventListener('scroll', this.throttle(() => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const rate = scrolled * -0.5;
        element.style.transform = `translateY(${rate}px)`;
      });
    }, 16));
  }
  
  // ===== MORPHING SHAPES =====
  setupMorphingShapes() {
    if (this.isReducedMotion) return;
    
    this.createMorphingBackground();
  }
  
  createMorphingBackground() {
    const morphingShapes = document.createElement('div');
    morphingShapes.className = 'morphing-shapes';
    morphingShapes.innerHTML = `
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    `;
    
    document.body.appendChild(morphingShapes);
    
    // Add CSS for morphing shapes
    const style = document.createElement('style');
    style.textContent = `
      .morphing-shapes {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
      }
      
      .shape {
        position: absolute;
        border-radius: 50%;
        filter: blur(40px);
        opacity: 0.1;
        animation: morphShape 20s ease-in-out infinite;
      }
      
      .shape-1 {
        width: 300px;
        height: 300px;
        background: linear-gradient(45deg, #ff6b9d, #7dd3fc);
        top: 20%;
        left: 10%;
        animation-delay: 0s;
      }
      
      .shape-2 {
        width: 200px;
        height: 200px;
        background: linear-gradient(45deg, #fbbf24, #a78bfa);
        top: 60%;
        right: 20%;
        animation-delay: 7s;
      }
      
      .shape-3 {
        width: 250px;
        height: 250px;
        background: linear-gradient(45deg, #34d399, #ff6b9d);
        bottom: 20%;
        left: 60%;
        animation-delay: 14s;
      }
      
      @keyframes morphShape {
        0%, 100% {
          transform: scale(1) rotate(0deg);
          border-radius: 50%;
        }
        25% {
          transform: scale(1.2) rotate(90deg);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        }
        50% {
          transform: scale(0.8) rotate(180deg);
          border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
        }
        75% {
          transform: scale(1.1) rotate(270deg);
          border-radius: 40% 60% 60% 40% / 60% 40% 40% 60%;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // ===== TEXT ANIMATIONS =====
  setupTextAnimations() {
    if (this.isReducedMotion) return;
    
    // Typewriter effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      this.addTypewriterEffect(heroTitle);
    }
    
    // Text reveal animations
    document.querySelectorAll('.text-reveal').forEach(element => {
      this.addTextRevealEffect(element);
    });
  }
  
  addTypewriterEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid var(--accent-pink)';
    
    let i = 0;
    const typeInterval = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      
      if (i >= text.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          element.style.borderRight = 'none';
        }, 1000);
      }
    }, 100);
  }
  
  addTextRevealEffect(element) {
    const text = element.textContent;
    const words = text.split(' ');
    element.innerHTML = '';
    
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      span.style.transition = `all 0.6s ease ${index * 0.1}s`;
      element.appendChild(span);
    });
    
    // Trigger animation when element is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const spans = entry.target.querySelectorAll('span');
          spans.forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
          });
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(element);
  }
  
  // ===== EFFECT UTILITIES =====
  createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.marginLeft = -size / 2 + 'px';
    ripple.style.marginTop = -size / 2 + 'px';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
  
  createClickEffect(element, x, y) {
    const rect = element.getBoundingClientRect();
    const clickX = x - rect.left;
    const clickY = y - rect.top;
    
    // Create sparkles at click position
    for (let i = 0; i < 6; i++) {
      const sparkle = document.createElement('div');
      sparkle.textContent = '✨';
      sparkle.style.cssText = `
        position: absolute;
        left: ${clickX}px;
        top: ${clickY}px;
        font-size: 12px;
        pointer-events: none;
        z-index: 9999;
        animation: sparkleOut 1s ease-out forwards;
        animation-delay: ${i * 0.1}s;
      `;
      
      element.appendChild(sparkle);
      
      setTimeout(() => {
        sparkle.remove();
      }, 1000);
    }
  }
  
  // ===== UTILITY FUNCTIONS =====
  throttle(func, limit) {
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
  
  debounce(func, wait) {
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
  
  // ===== PUBLIC METHODS =====
  triggerAnimation(element, animationType) {
    if (this.isReducedMotion) return;
    
    element.style.animation = `${animationType} 0.6s ease-out forwards`;
  }
  
  addCustomAnimation(element, keyframes, options = {}) {
    if (this.isReducedMotion) return;
    
    const animation = element.animate(keyframes, {
      duration: options.duration || 600,
      easing: options.easing || 'ease-out',
      fill: options.fill || 'forwards',
      ...options
    });
    
    return animation;
  }
  
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.animatedElements.clear();
  }
}

// ===== SPECIAL EFFECTS =====
class SpecialEffects {
  static createConfetti(x, y, count = 30) {
    const colors = ['#ff6b9d', '#7dd3fc', '#fbbf24', '#a78bfa', '#34d399'];
    
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        pointer-events: none;
        z-index: 9999;
        animation: confetti 3s ease-out forwards;
        animation-delay: ${i * 0.02}s;
      `;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
  }
  
  static createHeartRain(duration = 5000) {
    const interval = setInterval(() => {
      const heart = document.createElement('div');
      heart.textContent = '💖';
      heart.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: -50px;
        font-size: ${Math.random() * 20 + 15}px;
        pointer-events: none;
        z-index: 9999;
        animation: fallDown 4s linear forwards;
      `;
      
      document.body.appendChild(heart);
      
      setTimeout(() => {
        heart.remove();
      }, 4000);
    }, 200);
    
    setTimeout(() => {
      clearInterval(interval);
    }, duration);
  }
  
  static createFireworks(x, y) {
    const colors = ['#ff6b9d', '#7dd3fc', '#fbbf24', '#a78bfa', '#34d399'];
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      const angle = (Math.PI * 2 * i) / 20;
      const velocity = Math.random() * 100 + 50;
      
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: firework 2s ease-out forwards;
      `;
      
      particle.style.setProperty('--angle', angle + 'rad');
      particle.style.setProperty('--velocity', velocity + 'px');
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 2000);
    }
  }
}

// ===== ADD REQUIRED CSS ANIMATIONS =====
function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    @keyframes sparkleOut {
      0% {
        transform: scale(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: scale(1) rotate(180deg) translate(20px, -20px);
        opacity: 0;
      }
    }
    
    @keyframes fallDown {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
    
    @keyframes firework {
      0% {
        transform: translate(0, 0);
        opacity: 1;
      }
      100% {
        transform: translate(
          calc(cos(var(--angle)) * var(--velocity)),
          calc(sin(var(--angle)) * var(--velocity))
        );
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ===== INITIALIZATION =====
let animationController = null;

document.addEventListener('DOMContentLoaded', function() {
  addAnimationStyles();
  animationController = new AnimationController();
});

// ===== EXPORT FOR EXTERNAL USE =====
window.AnimationController = AnimationController;
window.SpecialEffects = SpecialEffects;

// Global animation functions
window.triggerConfetti = function(x, y, count) {
  SpecialEffects.createConfetti(x, y, count);
};

window.triggerHeartRain = function(duration) {
  SpecialEffects.createHeartRain(duration);
};

window.triggerFireworks = function(x, y) {
  SpecialEffects.createFireworks(x, y);
};


// ===== PARTICLES SYSTEM =====

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.isRunning = false;
    
    // Configuration
    this.config = {
      maxParticles: 50,
      particleTypes: ['heart', 'star', 'sparkle'],
      colors: ['#ff6b9d', '#7dd3fc', '#fbbf24', '#a78bfa', '#34d399'],
      spawnRate: 0.3, // particles per frame
      gravity: 0.02,
      wind: 0.01
    };
    
    this.resize();
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.start();
  }
  
  setupEventListeners() {
    window.addEventListener('resize', () => this.resize());
    
    // Mouse interaction
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.createParticleAt(x, y, 'sparkle');
    });
    
    // Touch interaction
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      this.createParticleAt(x, y, 'sparkle');
    });
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }
  
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      this.isRunning = false;
    }
  }
  
  createParticle(type = null) {
    if (this.particles.length >= this.config.maxParticles) return;
    
    const particleType = type || this.config.particleTypes[Math.floor(Math.random() * this.config.particleTypes.length)];
    const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
    
    const particle = {
      x: Math.random() * this.width,
      y: this.height + 20,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 3 - 1,
      size: Math.random() * 8 + 4,
      type: particleType,
      color: color,
      alpha: 1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      life: 1,
      decay: Math.random() * 0.01 + 0.005,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.1 + 0.05
    };
    
    this.particles.push(particle);
  }
  
  createParticleAt(x, y, type = 'sparkle') {
    if (this.particles.length >= this.config.maxParticles) return;
    
    const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
    
    const particle = {
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      size: Math.random() * 6 + 2,
      type: type,
      color: color,
      alpha: 1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      life: 1,
      decay: Math.random() * 0.02 + 0.01,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.2 + 0.1
    };
    
    this.particles.push(particle);
  }
  
  createHeartExplosion(x, y, count = 15) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 3 + 2;
      
      const particle = {
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 10 + 6,
        type: 'heart',
        color: '#ff6b9d',
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        life: 1,
        decay: Math.random() * 0.015 + 0.01,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.15 + 0.1
      };
      
      this.particles.push(particle);
    }
  }
  
  updateParticle(particle) {
    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;
    
    // Apply gravity and wind
    particle.vy += this.config.gravity;
    particle.vx += this.config.wind;
    
    // Update rotation
    particle.rotation += particle.rotationSpeed;
    
    // Update pulse
    particle.pulse += particle.pulseSpeed;
    
    // Update life
    particle.life -= particle.decay;
    particle.alpha = Math.max(0, particle.life);
    
    // Add some randomness to movement
    particle.vx += (Math.random() - 0.5) * 0.02;
    particle.vy += (Math.random() - 0.5) * 0.02;
    
    // Damping
    particle.vx *= 0.99;
    particle.vy *= 0.99;
  }
  
  drawParticle(particle) {
    this.ctx.save();
    
    // Set alpha
    this.ctx.globalAlpha = particle.alpha;
    
    // Move to particle position
    this.ctx.translate(particle.x, particle.y);
    this.ctx.rotate(particle.rotation);
    
    // Apply pulse effect
    const pulseScale = 1 + Math.sin(particle.pulse) * 0.2;
    this.ctx.scale(pulseScale, pulseScale);
    
    // Set color
    this.ctx.fillStyle = particle.color;
    this.ctx.strokeStyle = particle.color;
    
    // Draw based on type
    switch (particle.type) {
      case 'heart':
        this.drawHeart(particle.size);
        break;
      case 'star':
        this.drawStar(particle.size);
        break;
      case 'sparkle':
        this.drawSparkle(particle.size);
        break;
      default:
        this.drawCircle(particle.size);
    }
    
    this.ctx.restore();
  }
  
  drawHeart(size) {
    const x = 0;
    const y = 0;
    const s = size / 10;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + s * 4);
    this.ctx.bezierCurveTo(x, y + s * 2, x - s * 5, y + s * 2, x - s * 5, y + s * 4);
    this.ctx.bezierCurveTo(x - s * 5, y + s * 6, x, y + s * 10, x, y + s * 12);
    this.ctx.bezierCurveTo(x, y + s * 10, x + s * 5, y + s * 6, x + s * 5, y + s * 4);
    this.ctx.bezierCurveTo(x + s * 5, y + s * 2, x, y + s * 2, x, y + s * 4);
    this.ctx.fill();
  }
  
  drawStar(size) {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    
    this.ctx.beginPath();
    
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.closePath();
    this.ctx.fill();
  }
  
  drawSparkle(size) {
    const length = size;
    
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    
    // Vertical line
    this.ctx.beginPath();
    this.ctx.moveTo(0, -length);
    this.ctx.lineTo(0, length);
    this.ctx.stroke();
    
    // Horizontal line
    this.ctx.beginPath();
    this.ctx.moveTo(-length, 0);
    this.ctx.lineTo(length, 0);
    this.ctx.stroke();
    
    // Diagonal lines
    const diagLength = length * 0.7;
    this.ctx.beginPath();
    this.ctx.moveTo(-diagLength, -diagLength);
    this.ctx.lineTo(diagLength, diagLength);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(diagLength, -diagLength);
    this.ctx.lineTo(-diagLength, diagLength);
    this.ctx.stroke();
  }
  
  drawCircle(size) {
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  animate() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Spawn new particles
    if (Math.random() < this.config.spawnRate) {
      this.createParticle();
    }
    
    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      this.updateParticle(particle);
      this.drawParticle(particle);
      
      // Remove dead particles
      if (particle.life <= 0 || 
          particle.x < -50 || particle.x > this.width + 50 ||
          particle.y < -50 || particle.y > this.height + 50) {
        this.particles.splice(i, 1);
      }
    }
    
    // Continue animation
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  // Public methods for external control
  burst(x, y, type = 'heart', count = 10) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.createParticleAt(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20, type);
      }, i * 50);
    }
  }
  
  setConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
  
  clear() {
    this.particles = [];
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

// ===== FLOATING HEARTS SYSTEM =====
class FloatingHearts {
  constructor(container) {
    this.container = container;
    this.hearts = [];
    this.isActive = false;
    
    this.init();
  }
  
  init() {
    this.createHearts();
    this.start();
  }
  
  createHearts() {
    const heartCount = 8;
    const heartEmojis = ['💖', '💕', '💗', '💝', '💘'];
    
    for (let i = 0; i < heartCount; i++) {
      const heart = document.createElement('div');
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      heart.className = 'floating-heart';
      heart.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 20 + 15}px;
        opacity: ${Math.random() * 0.3 + 0.1};
        pointer-events: none;
        z-index: 1;
        animation: floatHeart ${Math.random() * 10 + 15}s linear infinite;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 10}s;
      `;
      
      this.container.appendChild(heart);
      this.hearts.push(heart);
    }
  }
  
  start() {
    this.isActive = true;
    this.animate();
  }
  
  stop() {
    this.isActive = false;
  }
  
  animate() {
    if (!this.isActive) return;
    
    this.hearts.forEach(heart => {
      // Add subtle movement
      const currentTransform = heart.style.transform || '';
      const time = Date.now() * 0.001;
      const x = Math.sin(time + parseFloat(heart.style.left)) * 10;
      const y = Math.cos(time + parseFloat(heart.style.top)) * 5;
      
      heart.style.transform = `${currentTransform} translate(${x}px, ${y}px)`;
    });
    
    requestAnimationFrame(() => this.animate());
  }
  
  addHeart(x, y) {
    const heart = document.createElement('div');
    heart.textContent = '💖';
    heart.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      font-size: 20px;
      pointer-events: none;
      z-index: 9999;
      animation: floatUp 3s ease-out forwards;
    `;
    
    this.container.appendChild(heart);
    
    setTimeout(() => {
      heart.remove();
    }, 3000);
  }
}

// ===== INITIALIZATION =====
let particleSystem = null;
let floatingHearts = null;

document.addEventListener('DOMContentLoaded', function() {
  // Initialize particle system
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    particleSystem = new ParticleSystem(canvas);
  }
  
  // Initialize floating hearts
  const heartsContainer = document.querySelector('.floating-hearts');
  if (heartsContainer) {
    floatingHearts = new FloatingHearts(heartsContainer);
  }
  
  // Add CSS for floating animations
  addFloatingAnimations();
});

function addFloatingAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatHeart {
      0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
      }
    }
    
    @keyframes floatUp {
      0% {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
      100% {
        transform: translateY(-100px) scale(0.5);
        opacity: 0;
      }
    }
    
    .floating-heart {
      will-change: transform;
    }
  `;
  document.head.appendChild(style);
}

// ===== EXPORT FOR EXTERNAL USE =====
window.ParticleSystem = ParticleSystem;
window.FloatingHearts = FloatingHearts;

// Global functions for easy access
window.createHeartExplosion = function(x, y, count = 15) {
  if (particleSystem) {
    particleSystem.createHeartExplosion(x, y, count);
  }
};

window.createParticleBurst = function(x, y, type = 'sparkle', count = 10) {
  if (particleSystem) {
    particleSystem.burst(x, y, type, count);
  }
};

window.addFloatingHeart = function(x, y) {
  if (floatingHearts) {
    floatingHearts.addHeart(x, y);
  }
};

// Performance optimization
let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (isReducedMotion) {
  // Disable particles for users who prefer reduced motion
  window.createHeartExplosion = function() {};
  window.createParticleBurst = function() {};
  window.addFloatingHeart = function() {};
}

